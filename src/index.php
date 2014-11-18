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
                <li role="presentation" class="active"><a href="#select-date" role="tab" data-toggle="tab">Select date</a></li>
                <li role="presentation"><a href="#select-interest" role="tab" data-toggle="tab">Select interest</a></li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                
                <!-- Select date tab -->
                <div role="tabpanel" class="tab-pane active" id="select-date">
                    <div class="current-choice">
                        Arriving: 
                        </br>
                        Departing:
                    </div>
                </div>
                
                <!-- Select interest tab -->
                <div role="tabpanel" class="tab-pane" id="select-interest">
                    <div class="current-choice">
                        I'm interested in:
                    </div>
                </div>
            </div>


        </div>

        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/hammerjs/hammer.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/bower_components/d3/d3.min.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/js/jukebox.js"></script>
    </body>
</html>
