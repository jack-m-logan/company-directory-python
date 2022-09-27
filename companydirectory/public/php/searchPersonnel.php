<?php

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}	

// $_REQUEST used for development / debugging. Remember to change to $_POST for production

$query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.email, d.name as departmentName, l.name as locationName from personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.lastName LIKE ? OR p.firstName LIKE ? OR p.email LIKE ? OR d.name LIKE ? OR l.name LIKE ? ORDER BY p.lastName');

$query->bind_param("sssss", $_REQUEST['search'], $_REQUEST['search'], $_REQUEST['search'], $_REQUEST['search'], $_REQUEST['search']);

$query->execute();

if (false === $query) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";	
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;

}

$result = $query->get_result();

$data = [];

while ($row = mysqli_fetch_assoc($result)) {

 array_push($data, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output); 

?>