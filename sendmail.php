<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	
	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	
	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('uk', 'phpmailer/language/');
	$mail->IsHTML(true);
	
	$mail->setFrom('herihol668@bodeem.com', 'Pulse');
	$mail->addAddress('vladfire2ink@gmail.com');
	$mail->Subject = 'Hello from Pulse';
	
	$body = '<h1>Hello</h1>';
	
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>;
	}
	if(trim(!empty($_POST['tel']))){
		$body.='<p><strong>Phone number:</strong> '.$_POST['tel'].'</p>;
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>Email:</strong> '.$_POST['tel'].'</p>;
	}
	
	$mail->Body = $body;
	
	if (!$mail->send()) {
		$message = 'Error';
	} else {
		$message = 'Success';
	}
	
	$response = ['message' => $message];
	
	header('Content-type: application/json');
	echo json_encode($response);
?>