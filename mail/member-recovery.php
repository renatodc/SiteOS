<?php

require_once '../api/dbtoken.php';
require_once 'helper.php';
require 'html2text.php';
require 'vendor/autoload.php';
use Mailgun\Mailgun;
$mg = Mailgun::create($config["mg_key"]);

#region LOOKUP EMAIL
$loginEmail = $_POST['LoginEmail'];

$filter = " WHERE (CustomerEmail = :LoginEmail OR CompanyEmail = :LoginEmail) AND IsDeleted = 0";
$query = "SELECT UUID,CustomerEmail,CompanyUUID FROM Customer" . $filter;
$sql = $pdo->prepare($query);
$sql->bindValue(':LoginEmail',$loginEmail);
$sql->execute();
$result = $sql->fetch();
$CustomerUUID = $result["UUID"];
$CustomerEmail = $result["CustomerEmail"];
$CompanyUUID = $result["CompanyUUID"];
#endregion
if(empty($CustomerUUID)) {
    $response["code"] = 0;
    $response["msg"] = "Email is not registered";
} else {
    #region GET COMPANY DATA
    $query = "SELECT CompanyName, DomainName FROM Company WHERE UUID = :UUID";
    $sql = $pdo->prepare($query);
    $sql->bindValue(':UUID',$CompanyUUID);
    $sql->execute();
    $result = $sql->fetch();
    $CompanyName = $result["CompanyName"];
    $DomainName = $result["DomainName"];
    #endregion
    #region CREATE RECOVERY TOKEN
    $query = "INSERT INTO TokenRecovery (TokenUUID, CustomerUUID, DateCreated, CreatedBy)
    VALUES (:TokenUUID, :CustomerUUID, :DateCreated, :CreatedBy)";
    $sql = $pdo->prepare($query);
    $token = generateUUID();
    $ipAddr = $_SERVER['REMOTE_ADDR'];
    $sql->bindValue(':TokenUUID',$token);
    $sql->bindValue(':CustomerUUID',$CustomerUUID);
    $sql->bindValue(':DateCreated',date("Y-m-d H:i:s"));
    $sql->bindValue(':CreatedBy',$ipAddr);
    $sql->execute();
    #endregion
    #region SEND RECOVERY EMAIL
    $recoveryURL = "https://app.$DomainName/recover?token=$token";
    $pfSubject = "Create a new password";
    $pfMessage = '<table bgcolor="#000000" border="0" cellpadding="0" cellspacing="0" width="100%">
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
                            <a href="#"><img alt="SiteOS" border="0" height="" src="cid:full-logo.png" style="display:block; width: 43%;" width=""></a>
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
                                                    <p style="font-family:Roboto, Helvetica, sans-serif; font-size:14px; color:#FFFFFF;">Greetings,<br /><br />Click on the following link to reset your password:</p>
                                                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0px">
                                                        <tbody>
                                                        <tr>
                                                            <td>
                                                                <a href="' . $recoveryURL . '"><img alt="Click here to reset your password" border="0" src="cid:pass-reset.png" style="display:block; width: 80%;"></a>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
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
                        <td align="center" width="560"></td>
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
    $params = array(
        'from'    => "$CompanyName Accounts <accounts@$DomainName>",
        'sender'  => "accounts@$DomainName",
        'to'      => $CustomerEmail,
        'subject' => $pfSubject,
        'text'    => $pfText,
        'html' => $pfMessage,
        'inline' => array(
            array('filePath' => '../img/sysmail/spacer.gif'),
            array('filePath' => '../img/sysmail/pass-reset.png'),
            array('filePath' => '../img/sysmail/full-logo.png')
        )
    );
    try {
        $mg->messages()->send($DomainName, $params);
        $response["code"] = 1;
    }
    catch(Exception $ex) {
        $response["code"] = 0;
        $response["msg"] = $ex->getMessage();;
    }
    #endregion
}
echo json_encode($response);
?>