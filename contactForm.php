<?php

error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");
 
if(isset($_POST['email'])) 
{
    $email_to = "nicolesilverthorn@hotmail.com";
    $email_subject = "Email From Your Website";
  
    function died($error) 
	{
        echo "Sorry, error(s) found with the form you submitted:<br /><br />";
        echo $error."<br />";
        echo "Please hit back and fix these errors.<br /><br />";
        die();
    }
 
    // validation expected data exists
    if(!isset($_POST['name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['subject']) ||
        !isset($_POST['message'])) {
        died('Sorry, but there appears to be a problem with the form you submitted.');       
    }
	
    $name = $_POST['name']; // required
    $email_from = $_POST['email']; // required
    $subject = $_POST['subject']; // not required
    $message = $_POST['message']; // required

    $error_message = "";
 
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
  if(!preg_match($email_exp,$email_from)) 
  {
	$error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }
 
    $string_exp = "/^[A-Za-z .'-]+$/";
 
  if(!preg_match($string_exp,$name)) 
  {
    $error_message .= 'The Name you entered does not appear to be valid.<br />';
  }
 
  if(strlen($message) < 2) 
  {
    $error_message .= 'The Message you entered does not appear to be valid.<br />';
  }
 
  if(strlen($error_message) > 0) 
  {
    died($error_message);
  }
 
    $email_message = "Form details below.\n\n";

    function clean_string($string) 
	{
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
 
    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Subject: ".clean_string($subject)."\n";
    $email_message .= "Message: ".clean_string($message)."\n";
 
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
$headers.="Return-Path:<nicolesilverthorn@hotmail.com>\r\n";

mail($email_to, $email_subject, $email_message, $headers);  

//phpinfo();

?>

Thank you for contacting me! I will be in touch with you very soon.
 
<?php
}
?>