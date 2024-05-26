/*
 * We are using the self executing function to make RepLogApp and Helper objects only accessible inside the function
 * They are now private and not public anymore.
 */
(function(window, $) {
    // Activate a more strict parsing mode
    'use strict';
    /* With window => RepLogApp becomes a global variable accessible everywhere */
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);
        // Attach event listeners
        this.$wrapper.find('.js-delete-rep-log').on('click', this.handleRepLogDelete.bind(this));
        this.$wrapper.find('tbody tr').on('click', this.handleRowClick.bind(this));
        this.$wrapper.find('.js-new-rep-log-form').on('submit', this.handleNewFormSubmit.bind(this))
    };

    $.extend(window.RepLogApp.prototype, {
        updateTotalWeightLifted : function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },
        handleRepLogDelete: function(e) {
            // Don't do the default browser behaviour for this event, navigate to its href
            e.preventDefault();

            // Don't bubble this event up the DOM tree
            // e.stopPropagation();

            // preventDefault + stopPrapagation <=> return false

            // Target : property on the event object, points to the clicked object
            // e.target is a DOM Element Object
            // e.target.className = e.target.className + ' text-danger'
            let $link = $(e.currentTarget);
            $link.addClass('text-danger');

            // CONSOLE DIR - see all the properties of a specified JavaScript object
            // console.dir(e.target);

            // Change trashcan to spinner
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin')

            // data() is a wrapper around core JS functionnality. The data-* attributes are also directly accessible on the DOM Element object
            // var deleteUrl = $(this)[0].dataset.url OR this.dataset.url
            let deleteUrl = $link.data('url');

            // Find the closest tr element by going up the DOM tree
            let $row = $link.closest('tr');

            // Variable self does not change inside callback functions
            let self = this;

            // Delete row
            $.ajax({
                url     : deleteUrl,
                method  : 'DELETE',
                success : function () {
                    $row.fadeOut('normal', function () {
                        $(this).remove(); // In fadeOut context, "this" is the element that was faded out
                        /* Like calling a static method in PHP */
                        self.updateTotalWeightLifted();
                    });
                }
            })
        },
        handleRowClick: function () {
            //
        },
        handleNewFormSubmit: function (e) {
            e.preventDefault();
            let $form = $(e.currentTarget);
            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize()
            })
        },
    });

    /**
     * A "private" object
     */
    let Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    /* When you create objects that need to be instantiated you need to add its properties and methods to the prototype key */
    $.extend(Helper.prototype, {
        calculateTotalWeight : function () {
            let totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight'); // $(this) is each tr
            });

            return totalWeight;
        }
    });

})(window, jQuery);
