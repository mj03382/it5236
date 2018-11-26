<?php
	
// Import the application classes
require_once('include/classes.php');

// Create an instance of the Application class
$app = new Application();
$app->setup();

// Declare an empty array of error messages
$errors = array();

?>

<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>WEALTH - N - KNOWLEDGE</title>
	<meta name="description" content="A collective of valuable information promoting the growth of individuals through the power of reading.">
	<meta name="author" content="Michael Jackson Jr.">
	<link rel="stylesheet" href="css/style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<?php include 'include/header.php'; ?>
	<h2></h2>
	<p>
		Welcome to Wealth -N- Knowledge. We strive to make learning fun again by encouraging reading among the youth on topics such as personal growth.
		Be sure to <a href="login.php">create an account</a> or proceed directly to the 
		<a href="login.php">login page</a>.
	</p>
	<?php include 'include/footer.php'; ?>
	<script src="js/site.js"></script>
</body>
</html>
