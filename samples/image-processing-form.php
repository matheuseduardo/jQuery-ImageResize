<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=windows-1250">
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="../src/jquery.imageresize.js"></script>
    <style type="text/css">
        .thumbs img {
            display: inline-block;
            margin:10px;
            box-shadow: 2px 2px 7px 1px rgba(0,0,0,0.4);
        }
    </style>
    <title></title>
</head>
<body>
    <input type="file" class="image-upload"/>
    <div class="thumbs"></div>
    <div class="campos">
        <input type="submit" id="submit" />
    </div>
    <script type="text/javascript">
    $(document).ready(function () {
        
        if (!window.File || !window.FileList || !window.FileReader) {
            alert('Your browser doesn\'t support' );
        }
        
        
        // define imagem de thumb quando selecionados
        $(".image-upload").ImageResize({
            maxWidth: 120,
            maxHeigth: 90,
            format: 'jpeg',
            qualityJpeg: 0.5,
            onBeforeResize: function() {
                $(".thumbs").html('');
            },
            onImageResized: function (imageData, i) {
                $(".thumbs").append($("<img/>", { src: imageData }));
                //console.log(imageData);
            }
        });
        
        // define campos hidden para submeter imagem
        var contador = 0;
        $(".image-upload").ImageResize({
            maxWidth: 1200,
            maxHeigth: 900,
            format: 'jpeg',
            qualityJpeg: 0.8,
            onBeforeResize: function() {
                contador = 0;
                $('.campos input[type=hidden]').remove()
            },
            onImageResized: function (imageData, indice, nome, tamanho) {
                $('.campos').append($('<input type="hidden" size="30" class="imgdata" name="teste'+ indice +'" value="' + imageData + '" />'));
            }
        });
        
        
        // postando imagens via ajax qunado clica em enviar
        $('#submit').on('click', function(e){
            e.preventDefault();
            
            var imagens = {};
            
            $('.campos .imgdata').each(function(i){
                imagens['imagem'+i] = this.value;
            });
            
            $.post('image-processing.php', imagens, function(data){
                console.log(data);
            });
        })
        
    });
    </script>
</body>
</html>
