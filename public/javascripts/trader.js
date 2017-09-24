
$(document).ready(function () {
    $('#datefrom').datetimepicker();
    $('#dateto').datetimepicker();


    // $('#datetimepicker1').datetimepicker();

    // var cars = ['CHANDIGARH', 'SHIMLA', "DELHI"];

    // // Constructing the suggestion engine
    // var cars = new Bloodhound({
    //     datumTokenizer: Bloodhound.tokenizers.whitespace,
    //     queryTokenizer: Bloodhound.tokenizers.whitespace,
    //     local: cars
    // });

    // // Initializing the typeahead
    // $('#market').typeahead({
    //     hint: true,
    //     highlight: true, /* Enable substring highlighting */
    //     minLength: 1 /* Specify minimum characters required for showing suggestions */
    // },
    //     {
    //         name: 'cars',
    //         source: cars
    //     });

    // $('.selectpicker').selectpicker({
    //     style: 'btn-default',
    //     size: 4
    // });

    $("#postreq").click(function () {
        var data = {
            name: $('#name').val(),
            email: $('#email').val(),
            phno: $('#phno').val(),
            market: $('#market').val(),
            crop: $('#crop').val(),
            price: $('#price').val(),
            qunatity: $('#quantity').val(),
            datefrom: $('#datefrom>input').val(),
            dateto: $('#dateto>input').val(),
        }
        $.ajax({
            type: "POST",
            data: data,
            url: "http://localhost:8000/data",
            success: function (result) {
                if (result == "success") {
                    alert("you have submitted your requirements.")
                }
            }
        });
    })

})

