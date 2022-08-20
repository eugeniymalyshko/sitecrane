<?php

// use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$checkboxes = $_POST['item'];

$title = "New form submited";
	$body = " <h1>New request from Sitecrane</h1>
<p><strong>Name: </strong>$name</p>
<p><strong>Email: </strong>$email</p>
<p><strong>Message: </strong>$message</p>";
if(!empty($_POST['item'])) {
	foreach ($_POST['item'] as $checkbox) {
	$body .= "<p><strong>Checked items: </strong>$checkbox</p>";
	}
}

$mail = new PHPMailer\PHPMailer\PHPMailer(true);
try {
	$mail->SMTPDebug = 0;
	$mail->isSMTP();     											// Set mailer to use SMTP
	$mail->Host = ''; //insert SMTP host                        // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = ''; // Inset full html adress                  // SMTP username
	$mail->Password = '';  // insert password               // SMTP password
	$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 465;
	$mail->CharSet = 'UTF-8';

	//Recipients
	$mail->setFrom('', 'Sitecrane'); // example ('john@mail.com', 'Sitecrane') this send from
	$mail->addAddress('', ''); // example ('john@mail.com', 'John Doe') this send to

	$mail->isHTML(true);												// Set email format to HTML
	$mail->Subject = $title;
   $mail->Body = $body;

	if (!$mail->send()) {
		$message = "Something went wrong, please try again later.";
	}else {
		$message = "Thank you for your enquiry, we'll take a look and get back
		to you!";
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
}
catch (Exception $e) {
	echo 'Message could not be sent.';
	echo 'Mailer Error: ' . $mail->ErrorInfo;
}

?>
