<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$response = ["status" => "error"];

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"])) {
    $file = $_FILES["file"];
    $filePath = $uploadDir . basename($file["name"]);

    if (move_uploaded_file($file["tmp_name"], $filePath)) {
        $response = [
            "status" => "success",
            "file_url" => "https://shaadu.vercel.app/api/uploads/" . $file["name"]
        ];
    }
}

echo json_encode($response);
?>
