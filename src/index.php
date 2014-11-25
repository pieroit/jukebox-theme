<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>SLT Jukebox</title>
        <meta name="viewport" content="width=device-width">        
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">

    </head>
    <body>
        <div id="main">
            
            <div id="header">
                <h1>I'll be in holiday in SalzburgerLand</h1>
            </div>

            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
                <li id="select-date-tab" role="presentation" class="active"><a href="#select-date" role="tab" data-toggle="tab">Select date</a></li>
                <li id="select-interest-tab" role="presentation"><a href="#select-interest" role="tab" data-toggle="tab">Select interest</a></li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                
                <!-- Select interest tab -->
                <div role="tabpanel" class="tab-pane" id="select-interest">
                    <div class="current-choice">
                        <label>I'm interested in:</label>
                        <input id="interest-input" name="interests[]" readonly />
                    </div>
                </div>
                
                <!-- Select date tab -->
                <div role="tabpanel" class="tab-pane active" id="select-date">
                    <div class="current-choice">
                        <label>Arriving:</label>
                        <input id="date-from-input" name="date-from" readonly />
                        </br>
                        <label>Departing:</label>
                        <input id="date-to-input" name="date-to" readonly />
                    </div>
                </div>
                
            </div>
            
            <div class="wheel-container">
                <!-- this svg will contain thw wheel and will expand to the size of the parent div -->
                <svg id="wheel"></svg>
            </div>


        </div>

        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/hammerjs/hammer.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/d3/d3.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/js/jukebox-functions.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/js/jukebox.js"></script>
    </body>
</html>
