/*
 * We are using the self executing function to make RepLogApp and Helper objects only accessible inside the function
 * They are now private and not public anymore.
 */
(function(window, $, Routing) {
    // Activate a more strict parsing mode
    'use strict';
    /* With window => RepLogApp becomes a global variable accessible everywhere */
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);
        // Attach event listeners
        // We attach to the wrapper because we have tr elements that are added dynamically
        this.$wrapper.on('click','.js-delete-rep-log', this.handleRepLogDelete.bind(this));
        this.$wrapper.on('click','tbody tr', this.handleRowClick.bind(this));
        this.$wrapper.on('submit',this._selectors.newRepForm, this.handleNewFormSubmit.bind(this));

        // Hydrate list
        this.loadRepLogList();
    };

    $.extend(window.RepLogApp.prototype, {
        _selectors: {
            newRepForm: '.js-new-rep-log-form'
        },
        loadRepLogList: function () {
            let self = this;
            $.ajax({
                url: Routing.generate('rep_log_list')
            }).then(function (data) {
                $.each(data.items, function(key, repLog) {
                    self._addRow(repLog);
                });
            })
        },
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
                method  : 'DELETE'
            }).then(function () {
                $row.fadeOut('normal', function () {
                    $(this).remove(); // In fadeOut context, "this" is the element that was faded out
                    /* Like calling a static method in PHP */
                    self.updateTotalWeightLifted();
                });
            });
        },
        handleRowClick: function () {
            //
        },
        handleNewFormSubmit: function (e) {
            e.preventDefault();
            let $form = $(e.currentTarget);
            let formData = {};
            // serializeArray => array of objects with "name" and "value" properties,
            // but we want an array of objects with name => value
            $.each($form.serializeArray(), function(key, fieldData) {
                formData[fieldData.name] = fieldData.value
            })
            let self = this;
            this._saveRepLog(formData)
            .then(function (data) {
                self._clearForm();
                self._addRow(data);
            }).catch(function (jqXHR) {
                let errorData = JSON.parse(jqXHR.responseText);
                self._mapErrorsToForm(errorData.errors);
            });
        },
        _saveRepLog: function (data) {
            return $.ajax({
                url: Routing.generate('rep_log_new'),
                method: 'POST',
                data: JSON.stringify(data)
            })
        },
        _mapErrorsToForm: function (errorData) {
            let $form = this.$wrapper.find(this._selectors.newRepForm);
            // Reset
            this._removeFormErrors();

            // Find all form elements
            $form.find(':input').each(function() {
                let fieldName = $(this).attr('name');
                let $fieldWrapper = $(this).closest('.form-group');
                if (!errorData[fieldName]) {
                    return; // no errors
                }
                let $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $fieldWrapper.append($error);
                $fieldWrapper.addClass('has-error');
            })
        },
        _removeFormErrors: function () {
            let $form = this.$wrapper.find(this._selectors.newRepForm);
            // Reset
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        },
        _clearForm: function () {
            this._removeFormErrors();
            let $form = this.$wrapper.find(this._selectors.newRepForm);
            // $form[0] access the 1st JS DOM ELEMENT (which is the form)
            $form[0].reset();

        },
        _addRow: function (repLog) {
            // locate template text,
            let templateText = $('#js-rep-log-row-template').html();
            // prepare template
            let template = _.template(templateText);
            // render template with the variables that should be available in the template
            let rawHtml = template(repLog);
            // parseHTML => turns raw html into a jQuery object
            this.$wrapper.find('tbody')
                .append($.parseHTML(rawHtml));
            this.updateTotalWeightLifted();
        }
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

})(window, jQuery, Routing);
