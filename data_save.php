<?php
// Create a database connection
$mysqli = mysqli_connect("localhost","eco_mdb_root","KZrQupBmNL", "eco_mdb1");

if (mysqli_connect_errno($mysqli)) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Get values passed from JS
$ip = $_SERVER['REMOTE_ADDR'];
$date = date('Y-m-d');
$results = $_POST['results'];

//Create a query
$query = "INSERT INTO yu_he_exp (ip, date, results) VALUES ('{$ip}', '{$date}', '{$results}')";

//Do it
$check = mysqli_query($mysqli, $query);
if (!$check) {
    die('Error: ' . mysqli_error($mysqli));
} else {
    echo "New record created successfully";
}

//Close connection
mysqli_close($mysqli);
?>