
$(document).ready(function () {
    $(".loading").hide()
    $('#datetimepicker1').datetimepicker();
    $("#analytics").hide()

    var cars = ['CHANDIGARH', 'SHIMLA', "DELHI"];

    // Constructing the suggestion engine
    var cars = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: cars
    });

    // Initializing the typeahead
    $('#market').typeahead({
        hint: true,
        highlight: true, /* Enable substring highlighting */
        minLength: 1 /* Specify minimum characters required for showing suggestions */
    },
        {
            name: 'cars',
            source: cars
        });
    $('.selectpicker').selectpicker({
        style: 'btn-default',
        size: 4
    });
    $('#date').datetimepicker();
    $("#predict").click(function () {
        $("#onload").hide()
        var data = {
            commodity: $('#hello>div>button')[0].innerText,
            days: $('#stockdays').val(),
            market: $('#market').val(),
            date: $('#datetimepicker1>input').val(),
        }
        $(".loading").show()
        $.ajax({
            type: "POST",
            data: data,
            url: "http://localhost:8000/hello",
            success: function (result) {
                console.dir(result)
                $(".loading").hide()

                var chart = c3.generate({
                    bindto: '.chart',
                    data: {
                        x: 'x',
                        //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                        columns: result.chart
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%Y-%m-%d'
                            }
                        }
                    }
                });
                $('.prediction').text(`You should sell product ${result.fromnow}.\n You will get Rs.${Math.floor(result.price)}`)
                $("#analytics").show()
                data = "";
                result.ticktock.map(function (re) {
                    data = data + `<div class="col-xs-3"><img style="width:300px;height:300px" src="/images/image.png" /><h3>Name:${re.name}</h3><p>Email:${re.email}</p><p>Phone Number:${re.phno}</p><p>Market:${re.market}</p><p>Crop:${re.crop}</p><p>Price:Rs.${re.price}</p><p>Quantity:${re.quantity}</p><p>Date From:${re.datefrom}</p><p>Date To:${re.dateto}</p></div>`
                })

                $(".prospectivesellers").html(`<h3 class='prediction' style="text-align:center">
    Few sellers are interested in buying your product.<br/> You can connect with them:
  </h3>
  <div class="row">
${data}
  </div>`)
            }
        });

    })

})

