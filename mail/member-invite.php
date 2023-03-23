<?php

require_once '../api/session.php';
require_once '../api/dbtoken.php';
require_once 'helper.php';
require 'html2text.php';
require 'vendor/autoload.php';
validateCsrfToken();
use Mailgun\Mailgun;
$mg = Mailgun::create($config["mg_key"]);

#region GET MESSAGE PARAMETERS
$uuid = $_REQUEST['UUID'];
$pfName = $_REQUEST['CustomerName'];
$pfRole = "";
if(!empty($_REQUEST['CustomerRole'])) {
    $pfRole = $_REQUEST['CustomerRole'];
}
$pfEmail = $_REQUEST['InviteEmail'];
$pfPhone = "";
if(!empty($_REQUEST['CustomerPhone'])) {
    $pfPhone = $_REQUEST['CustomerPhone'];
}
$pfCompanyEmail = "";
if(!empty($_REQUEST['CompanyEmail'])) {
    $pfCompanyEmail = $_REQUEST['CompanyEmail'];
}
#endregion
#region GET COMPANY DATA
$query = "SELECT CompanyName, DomainName FROM Company WHERE UUID = :UUID";
$sql = $pdo->prepare($query);
$sql->bindValue(':UUID',$CompanyUUID);
$sql->execute();
$result = $sql->fetch();
$CompanyName = $result["CompanyName"];
$DomainName = $result["DomainName"];
#endregion
#region CREATE INVITE TOKEN
$query = "INSERT INTO TokenRegister (TokenUUID, CustomerUUID, DateCreated, CreatedBy)
                VALUES (:TokenUUID, :CustomerUUID, :DateCreated, :CreatedBy)";
$sql = $pdo->prepare($query);
$token = generateUUID();
$sql->bindValue(':TokenUUID',$token);
$sql->bindValue(':CustomerUUID',$uuid);
$sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
$sql->bindValue(':CreatedBy',$CustomerUUID);
$sql->execute();
#endregion
#region PREPARE INVITE MESSAGE
$companyURL = "https://" . $DomainName;
$inviteURL = "https://app." . $DomainName . "/invite?token=" . $token;
$pfSubject = "Set up your $CompanyName account";
$msgLine1 = 'Greetings,<br /><br />You have a new account for <strong>' . $DomainName . '</strong>.';
$msgLine2 = 'Your username is: <strong>' . $pfCompanyEmail . '</strong>.';
$msgPwdBtnImg = '<img alt="Click here to set up your password" border="0" src="cid:pass-setup.png" style="display:block; width: 80%;" />';
$msgLine3 = '';
$msgFooter = date("Y");
switch($_REQUEST['CustomerLanguage']) {
    case "es":
        $pfSubject = "Configura tu cuenta de $CompanyName";
        $msgLine1 = 'Saludos,<br /><br />Tienes una nueva cuenta para <strong>' . $DomainName . '</strong>.';
        $msgLine2 = 'Tu nombre de usuario es: <strong>' . $pfCompanyEmail . '</strong>.';
        $msgPwdBtnImg = '<img alt="Click aquí para ingresar tu clave" border="0" src="cid:pass-setup.png" style="display:block; width: 80%;" />';
        $msgLine3 = '';
        $msgFooter = date("Y");        
        break;
}
$pfMessage = '<table bgcolor="#000" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tbody>
    <tr>
        <td align="center" width="560">
            <table border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td><img alt="" border="0" height="14" src="cid:spacer.gif" style="display:block;" width="8"></td>
                </tr>
                </tbody>
            </table>
            <table bgcolor="#000000" border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td>
                        <a href="'.$companyURL.'"><img alt="SiteOS" border="0" height="" src="cid:full-logo.png" style="display:block; width: 43%;" width=""></a>
                    </td>
                </tr>
                </tbody>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td><img alt="" border="0" height="14" src="cid:spacer.gif" style="display:block;" width="8"></td>
                </tr>
                </tbody>
            </table>
            <table bgcolor="#000000" border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td width="558">
                        <table border="0" cellpadding="0" cellspacing="0" width="558">
                            <tbody>
                            <tr>
                                <td width="14">&nbsp;</td>
                                <td width="520">
                                    <table border="0" cellpadding="0" cellspacing="0" width="520">
                                        <tbody>
                                        <tr>
                                            <td align="left" valign="top">
                                                <p style="font-family:Roboto, Helvetica, sans-serif; font-size:14px; color:#FFF;">' . $msgLine1 . '</p>
                                                <p style="font-family:Roboto, Helvetica, sans-serif; font-size:14px; color:#FFF;">' . $msgLine2 . '</p>
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <a href="' . $inviteURL . '">' . $msgPwdBtnImg . '</a>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p style="font-family:Roboto, Helvetica, sans-serif; font-size:14px; color:#FFF;">' . $msgLine3 . '</p>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" width="520">
                                        <tbody>
                                        <tr>
                                            <td><img alt="" border="0" height="30" src="cid:spacer.gif" style="display:block;" width="8"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td width="19">&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td><img alt="" border="0" height="20" src="cid:spacer.gif" style="display:block;" width="8"></td>
                </tr>
                </tbody>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td align="center" width="560">' . $msgFooter . '</td>
                </tr>
                </tbody>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="560">
                <tbody>
                <tr>
                    <td><img alt="" border="0" height="30" src="cid:spacer.gif" style="display:block;" width="8"></td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>';
$pfText = convert_html_to_text($pfMessage);
#endregion
#region SEND INVITE MESSAGE
$params = array(
    'from'    => "$CompanyName Accounts <accounts@$DomainName>",
    'sender'  => "accounts@$DomainName",
    'to'      => $pfEmail,
    'subject' => $pfSubject,
    'text'    => $pfText,
    'html' => $pfMessage,
    'inline' => array(
        array('filePath' => '../img/sysmail/spacer.gif'),
        array('filePath' => '../img/sysmail/pass-setup.png'),
        array('filePath' => '../img/sysmail/full-logo.png')
    )
);
try {
    $mg->messages()->send($DomainName, $params);
    $response["success"] = 1;
}
catch(Exception $error) {
    $response["error"] = $error;
}
#endregion
echo json_encode($response);

?>