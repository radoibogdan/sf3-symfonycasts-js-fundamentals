<?php

namespace AppBundle\Controller;

use AppBundle\Entity\RepLog;
use AppBundle\Form\Type\RepLogType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LiftController extends BaseController
{
    /**
     * @Route("/lift", name="lift")
     */
    public function indexAction(Request $request)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        $form = $this->createForm(RepLogType::class);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $repLog = $form->getData();
            $repLog->setUser($this->getUser());

            $em->persist($repLog);
            $em->flush();

//            if ($request->isXmlHttpRequest()) {
//                return $this->render('lift/_repRow.html.twig', [
//                    'repLog' => $repLog,
//                ]);
//            }

            $this->addFlash('notice', 'Reps crunched!');

            return $this->redirectToRoute('lift');
        }

        // We have ajax requests on form submit, so at this point we know the form validation has failed
//        if ($request->isXmlHttpRequest()) {
//            $html = $this->renderView('lift/_form.html.twig', [
//                'form' => $form->createView(),
//            ]);
//            return new Response($html, 400);
//        }

        return $this->render('lift/index.html.twig', array(
            'form' => $form->createView(),
            'leaderboard' => $this->getLeaders(),
        ));
    }

    /**
     * Returns an array of leader information
     *
     * @return array
     */
    private function getLeaders()
    {
        $leaderboardDetails = $this->getDoctrine()->getRepository('AppBundle:RepLog')
            ->getLeaderboardDetails()
        ;

        $userRepo = $this->getDoctrine()->getRepository('AppBundle:User');
        $leaderboard = array();
        foreach ($leaderboardDetails as $details) {
            if (!$user = $userRepo->find($details['user_id'])) {
                // interesting, this user is missing...
                continue;
            }

            $leaderboard[] = array(
                'username' => $user->getUsername(),
                'weight' => $details['weightSum'],
                'in_cats' => number_format($details['weightSum']/RepLog::WEIGHT_FAT_CAT),
            );
        }

        return $leaderboard;
    }
}
