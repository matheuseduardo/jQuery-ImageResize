<?php

$sucesso = true;
$retorno = [ "sucesso" => $sucesso,
    "erro" => [
        "codigo" => "",
        "mensagem" => ""
    ],
    "retorno" => []
];

$retorno['retorno'] = count($_POST);
foreach($_POST as $item => $data) {
    if(preg_match('/data:image\/(gif|jpeg|png);base64,(.*)/i', $data, $matches)) {
        $imageType = $matches[1];
        $imageData = base64_decode($matches[2]);

        $image = imagecreatefromstring($imageData);
        $filename = md5($imageData) . '.jpg';
        
        imagejpeg($image, $filename, 85);
    }
}

header('Content-Type: application/json');
echo json_encode($retorno);

