(function($) {
    $.fn.ImageResize = function(options) {
        var defaults = {
            maxWidth: Number.MAX_VALUE,
            maxHeight: Number.MAX_VALUE,
            longestEdge: Number.MAX_VALUE,
            maxFilesNumber: 3,
            onBeforeResize: null,
            onImageResized: null,
            onFailure: function (message) { 
                if (window.console) { console.log(message) };
            },
            format: 'png',
            qualityJpeg: 0.9,
            debugLevel: 0
        };
        
        var settings = $.extend({}, defaults, options);
        var selector = $(this);
        
        selector.each(function(index) {
            var control = selector.get(index);
            if ($(control).prop("tagName").toLowerCase() == "input" && $(control).prop("type").toLowerCase() == "file") {
                $(control).prop("accept", "image/*");
                $(control).prop("multiple", "true");
                
                control.addEventListener('change', handleFileSelect, false);
            } else {
                settings.onFailure("Invalid file input field");
            }
        });
        
        function handleFileSelect() {
            
            if (settings.onBeforeResize !== null && typeof (settings.onBeforeResize) == "function") {
                settings.onBeforeResize();
            }
            
            //Check File API support
            if (window.File && window.FileList && window.FileReader) {
                var files = event.target.files;
                if (files.length === 0) {
                    settings.onFailure("No file selected.");
                    return false;
                }
                
                var count = 0;
                
                for (var i = 0; i < files.length; i++) {
                    var uploadedFile = files[i];
                    var reader = new FileReader();
                    
                    // Only pics
                    if (!uploadedFile.type.match('image')) {
                        settings.onFailure("File " + uploadedFile.name + " does not match image type.");
                    }
                    else {
                        
                        reader.fileIndex = count;
                        reader.fileName = uploadedFile.name;
                        reader.fileSize = uploadedFile.size;
                        
                        reader.addEventListener("load", function(event) {
                            var file = event.target;
                            var fileData = file.result;
                            
                            var canvasSettings = {
                                width: 0,
                                height: 0,
                                adjustedHeight: Number.MAX_VALUE,
                                adjustedWidth: Number.MAX_VALUE,
                                img: new Image()
                            };
                            
                            canvasSettings.img.reader = this;
                            
                            canvasSettings.img.src = fileData;
                            canvasSettings.img.onload = function(e) {
                                canvasSettings.height = canvasSettings.img.height;
                                canvasSettings.width = canvasSettings.img.width;
                                
                                if (settings.longestEdge == Number.MAX_VALUE) {
                                    if (canvasSettings.img.width > settings.maxWidth || canvasSettings.img.height > settings.maxHeight) {
                                        
                                        if (canvasSettings.img.width > settings.maxWidth) {
                                            setBasedOnWidth(settings.maxWidth, canvasSettings);
                                        }
                                        
                                        if (canvasSettings.height > settings.maxHeight) {
                                            setBasedOnHeight(settings.longestEdge, canvasSettings);
                                        }
                                    }
                                }
                                else {
                                    var widthIsLongest = (canvasSettings.img.width > canvasSettings.img.height) ? true : false;
                                    if (widthIsLongest) {
                                        if (canvasSettings.img.width > settings.longestEdge) {
                                            setBasedOnWidth(settings.longestEdge, canvasSettings);
                                        }
                                    }
                                    else {
                                        if (canvasSettings.img.height > settings.longestEdge) {
                                            setBasedOnHeight(settings.longestEdge, canvasSettings);
                                        }
                                    }
                                }
                                
                                var canvas = $("<canvas/>").get(0);
                                canvas.width = canvasSettings.width;
                                canvas.height = canvasSettings.height;
                                var context = canvas.getContext('2d');
                                context.drawImage(canvasSettings.img, 0, 0, canvasSettings.width, canvasSettings.height);
                                
                                // verify format / quality
                                if (settings.format.match(/jpe?g/gi)) {
                                    qualityJpeg = !isNaN(settings.qualityJpeg) ? settings.qualityJpeg : 0.9;
                                    fileData = canvas.toDataURL('image/jpeg', qualityJpeg);
                                }
                                else {
                                    fileData = canvas.toDataURL();
                                }
                                
                                // callback function
                                if (settings.onImageResized !== null && typeof (settings.onImageResized) == "function") {
                                    settings.onImageResized(fileData, this.reader.fileIndex, this.reader.fileName, this.reader.fileSize);
                                }
                                
                            };
                            
                            canvasSettings.img.onerror = function() {
                                settings.onFailure("Please upload a file.");
                            };
                        });
                    }
                    
                    //Read the file
                    reader.readAsDataURL(uploadedFile);
                    
                }
            } else {
                settings.onFailure("Your browser does not support File API");
            }
            
        }
        
        function setBasedOnWidth(adjustedWidth, canvasSettings) {
            canvasSettings.width = adjustedWidth;
            var ration = canvasSettings.width / canvasSettings.img.width;
            canvasSettings.height = Math.round(canvasSettings.img.height * ration);
        }
        
        function setBasedOnHeight(adjustedHeight, canvasSettings) {
            canvasSettings.height = adjustedHeight;
            var ration = canvasSettings.height / canvasSettings.img.height;
            canvasSettings.width = Math.round(canvasSettings.img.width * ration);
        }
        
    };
}(jQuery));
