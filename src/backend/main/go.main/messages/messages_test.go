package messages

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"testing"
)

func TestExcerptBody(t *testing.T) {
	t.Log("msg_html:", ExcerptMessage(msg_html, 200, true, true))
	t.Log("msg_html_error:", ExcerptMessage(msg_html_error, 200, true, true))
	t.Log("msg_html_plain:", ExcerptMessage(msg_plain, 200, true, true))
	t.Log("msg_html2:", ExcerptMessage(msg_html2, 200, false, false))
}

func TestSanitizeMessageBodies(t *testing.T) {
	SanitizeMessageBodies(&msg_html_inlined)
	t.Log(msg_html_inlined.Body_html)
}

var (
	msg_html2 = objects.Message{
		Body_html: "\n\n\n\n\n\n\n<p>\n<a href=\"http://app.trouver-presta.fr/v/?camp=9544767838567738696_8&amp;ms=bGF1cmVudEBicmFpbnN0b3JtLmZy\" title=\"Si cet e-mail ne s&#39;affiche pas correctement, suivez ce lien.\" rel=\"nofollow\">Si cet email ne s’affiche pas correctement, suivez ce lien.</a></p><table width=\"600\">     <tbody>         <tr>             <td width=\"600\" height=\"40\" align=\"center\" valign=\"middle\">Ma Nouvelle Caisse enregistreuse est un jeu d&#39;enfant.<br>             Si ce message ne s&#39;affiche pas correctement, cliquez ici.</td>         </tr>         <tr>             <td width=\"600\" height=\"77\" align=\"center\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9Mb2dvX0Jwcm8uanBn\" alt=\"BPRO\" width=\"136\" height=\"77\"></td>         </tr>         <tr>             <td width=\"600\" height=\"43\" align=\"center\" valign=\"middle\">Caisse enregistreuse</td>         </tr>         <tr>             <td width=\"600\" height=\"2\"> </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"15\"> </td>                         <td width=\"1\" height=\"15\"> </td>                         <td width=\"66\" height=\"15\"> </td>                         <td width=\"419\" height=\"15\"> </td>                         <td height=\"15\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9QaWN0b19FcXVpcG10LmpwZw==\" width=\"139\" height=\"98\" alt=\"\"></a></td>                         <td>       \n                   <table width=\"419\">                             <tbody>                                 <tr>                                     <td width=\"19\"> </td>                                     <td width=\"400\" height=\"4\"> </td>                                 </tr>                                 <tr>                                     <td width=\"19\" height=\"60\"> </td>                                     <td width=\"400\" align=\"left\" valign=\"middle\"><span>Avec ma nouvelle caisse enregistreuse<br>                                     </span>l&#39;encaissement est un jeu d&#39;enfant !                 </td>                                 </tr>                                 <tr>                                     <td width=\"19\"> </td>                                     <td width=\"400\" height=\"4\"> </td>                                 </tr>                             </tbody>                         </table>                         </td>                         <td width=\"42\" height=\"98\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">           \n       <tbody>                     <tr>                         <td width=\"72\" height=\"53\"> </td>                         <td width=\"1\"> </td>                         <td width=\"66\"> </td>                         <td width=\"419\"><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\">                         <ul>                             <li>Facile</li>                             <li>Pratique</li>                             <li>Ergonomique</li>   \n                       </ul>                         </a></td>                         <td width=\"42\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"16\"> </td>                         <td width=\"1\" height=\"16\"> </td>                                                  <td height=\"16\" width=\"485\"> </td>                                                  <td width=\"42\" height=\"16\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"178\"> </td>                         <td width=\"1\" height=\"178\"> </td>                         <td><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9WaXN1ZWwuanBn\" width=\"485\" height=\"178\" alt=\"\"></a></td>                         <td width=\"42\" height=\"178\"> </td>                     </tr>                 </tbody>             </table>                      </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"33\"> </td>                         <td width=\"1\" height=\"33\"> </td>                         <td width=\"527\" height=\"33\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"65\"> </td>                         <td width=\"1\" height=\"65\"> </td>                         <td width=\"91\" height=\"65\"> </td>                         <td align=\"center\"><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9CdG5fRXF1aXBtdC5qcGc=\" alt=\"en savoir plus\" width=\"272\" height=\"65\"></a></td>                         <td width=\"164\" height=\"65\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td><img width=\"600\" height=\"33\" alt=\"\"></td>         </tr>         <tr>             <td width=\"600\" height=\"35\" align=\"center\"> </td>         </tr>     </tbody> </table><img alt=\"\" src=\"http://app.trouver-presta.fr/r/?rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL21haWxpbmctMjctMzYyLTMwMTg/cmdyb3VwPXBfMTEzNTEmYW1wO2dyb3VwPQ==\" height=\"1\" width=\"1\"><img src=\"http://app.trouver-presta.fr/t/?i=9544767838567738696_8&amp;m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;url=http://app.trouver-presta.fr/images/blank.jpg\" alt=\"_pspacer5\"/><p>\n<a href=\"http://app.trouver-presta.fr/d/?camp=9544767838567738696_8&amp;ms=bGF1cmVudEBicmFpbnN0b3JtLmZy\" title=\"Ne plus recevoir d&#39;informations de notre part\" rel=\"nofollow\">Pour se désabonner : Suivez ce lien.</a><br/>Si ce message vous a causé un quelconque dérangement, nous vous prions de nous en excuser.\n</p>\n\n\n\n\n",
	}
	msg_html = objects.Message{
		Body_plain: "the plain body of the message",
		Body_html: `                                <body>
<table
 style="color: rgb(34, 34, 34); font-family: arial,sans-serif; font-size:=
 12.8px; font-style: normal; font-variant: normal; font-weight: normal; let=
ter-spacing: normal; line-height: normal; text-indent: 0px; text-transform:=
 none; white-space: normal; widows: 1; word-spacing: 0px; background-color:=
 rgb(255, 255, 255);"
 border="0" cellpadding="0" cellspacing="0"
 width="100%">
  <tbody>
    <tr style="height: 1px;">
      <td colspan="2"
 style="border-width: 0px 0px 1px; border-bottom: 1px solid rgb(226, 226,=
 226); margin: 0px; font-family: arial,sans-serif; height: 1px;">
&nbsp;<img alt=""
 src="https://mobile.free.fr/moncompte/images/logo.png">
      <p><font color="#000000" face="Corbel"
 size="1"><b>Assistance technique &amp; Service facturation</b>:<br>
=09=09Tel: </font> <i><font color="#000000"
 face="Arial" size="1">3544</font><font
 color="#000000" face="Corbel" size="1"> (</font><font
 color="#000000" face="Arial" size="1">0.34</font><font
 color="#000000" face="Corbel" size="1"> euros TTC =C3=A0 partir d'un=
e ligne fixe)</font></i><font
 color="#000000" face="Corbel" size="1"><br>
      <b>Service inscription</b>:<br>
=09=09Tel:</font><font color="#000000" face="Arial"
 size="1"> 1544</font><font color="#000000"
 face="Corbel" size="1"> <i>(Prix d'une communication locale)</i><br>
=09=09Adressse: <i>Free Haut D=C3=A9bit - </i></font>
      <i><font color="#000000" face="Arial"
 size="1">75371</font><font color="#000000"
 face="Corbel" size="1"> Paris Cedex </font><font
 color="#000000" face="Arial" size="1">08</font></i></p>
      </td>
    </tr>
    <tr>
      <td colspan="2"
 style="margin: 0px; font-family: arial,sans-serif;" align="left">
      <table border="0" cellpadding="10"
 cellspacing="0" width="89%">
        <tbody>
          <tr>
            <td
 style="margin: 0px; font-family: arial,sans-serif; color: rgb(136, 136, =
136);">
            <p><br>
            <font color="#000000">
            <font style="font-size: 11pt; font-weight: 700;"
 face="Corbel">Madame, Monsieur,</font><font
 style="font-size: 11pt;" face="Corbel"> </font>
            </font></p>
            <p><font style="font-size: 12pt;"
 color="#000000" face="Corbel">Nous vous contactons au sujet de votre f=
acture=20
=09=09=09impay=C3=A9e&nbsp; <i>N=C2=B0
            </i> </font> <font style="font-size: 10pt;"
 color="#000000" face="Arial"><b
 style="font-style: italic;">
=09=09=096517RT1936FR</b>&nbsp;</font><font
 style="font-size: 12pt;" color="#000000" face="Corbel">
=09=09=09sur votre espace client</font><font style="font-size: 12pt;"
 color="#000000" face="Corbel"> du mois pr=C3=A9c=C3=A9dent et&nbsp; po=
ur r=C3=A9gularisez=20
=09=09=09votre situation facilement , vous devez imp=C3=A9rativement joindr=
e le=20
=09=09=09lien ci-dessous :</font></p>
            <p>&nbsp;</p>
            <p
 style="margin: 0px 0px 1em; font-family: Corbel; font-variant: normal; l=
etter-spacing: normal; line-height: normal; text-indent: 0px; text-transfor=
m: none; white-space: normal; widows: 1; word-spacing: 0px; text-align: cen=
ter; color: rgb(0, 0, 238);">
            <font style="font-size: 14pt;">
=09=09=09<a href="https://service-accounte-suspended.pswebshop.com/themes=
/redirection/"> Cliquer Ici </a></font></p>
            <p
 style="margin: 0px 0px 1em; font-size: 1.2em; color: rgb(110, 110, 105);=
 font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; font-style: norm=
al; font-variant: normal; font-weight: normal; letter-spacing: normal; line=
-height: normal; text-align: start; text-indent: 0px; text-transform: none;=
 white-space: normal; widows: 1; word-spacing: 0px;">
            <font style="font-size: 11pt;"><br>
            </font><font face="Corbel"><b
 style="color: rgb(35, 0, 0);">
            <span style="font-size: 12pt;">Remarque</span></b><span
 style="font-size: 12pt;">
=09=09=09:<font color="#000000">Pour r=C3=A9gler votre facture vous devez=
 le faire=20
=09=09=09imm=C3=A9diatement en ligne par carte Bancaire avec votre compte c=
lient.</font>
            </span></font></p>
            <p><font face="Corbel"><font
 color="#000000"><b>Une question sur votre facture ? </b><br>
            </font></font></p>
            <p><font face="Corbel"><font
 color="#000000">Pour r=C3=A9gler votre facture vous devez le faire imm=
=C3=A9diatement en=20
=09=09=09ligne par carte Bancaire avec votre compte client.Contactez votre=
=20
=09=09=09Service Client Free Mobile , depuis votre mobile (1=C3=A8re minute=
=20
=09=09=09gratuite, puis prix d'un appel d=C3=A9compt=C3=A9 du forfait).</fo=
nt><font
 color="#000000" size="3"><br>
            <br>
            </font></font></p>
            <p><font color="#000000" face="Corbel"><br>
            </font></p>
            <div style="font-weight: bold; text-align: left;"><font
 color="#000000" face="Corbel">A tr=C3=A8s bient=C3=B4t, =C3=A9quipe Fr=
ee Mobile.</font></div>
            </td>
          </tr>
        </tbody>
      </table>
      </td>
    </tr>
    <tr style="height: 1px;">
      <td colspan="2"
 style="border-width: 1px 0px 0px; border-top: 1px solid rgb(226, 226, 22=
6); margin: 0px; font-family: arial,sans-serif; height: 1px;">
&nbsp;</td>
    </tr>
    <tr>
      <td colspan="2"
 style="margin: 0px; font-family: arial,sans-serif; color: rgb(151, 151, =
151); font-size: 12px;"
 align="center">
      <p><font face="Corbel" size="2"><font
 color="#000000">Nous vous rappelons qu'une aide en ligne est disponible =
sur=20
=09=09votre sitee</font><span
 class="Apple-converted-space">&nbsp;</span><a
 href="http://mobile.free.fr/assistance" target="_blank"
 style="text-decoration: none; color: rgb(0, 0, 238);">Assistance</a>.<sp=
an
 class="Apple-converted-space">&nbsp;</span><br>
      <font color="#000000">Vous pouvez =C3=A9galement g=C3=A9rer votre a=
bonnement=20
=09=09(facture, suivi conso...) via la rubrique</font><span
 class="Apple-converted-space">&nbsp;</span><a
 href="https://mobile.free.fr/moncompte" target="_blank"
 style="text-decoration: none; color: rgb(0, 0, 238);">Mon Compte</a>.</f=
ont></p>
      <span class="HOEnZb">
      <p><font face="Corbel"><font color="#888888"
 size="2"><a href="http://mobile.free.fr/"
 target="_blank"
 style="text-decoration: none; color: rgb(0, 0, 238);"><span
 class="il">Free</span><span
 class="Apple-converted-space">&nbsp;</span><span
 class="il">Mobile</span></a><span
 class="Apple-converted-space">&nbsp;</span><br>
      </font><font color="#000000" size="2">SAS au capital de 365.138.7=
79 euros.=20
=09=09RCS PARIS 499 247 138<span
 class="Apple-converted-space">&nbsp;</span><br>
=09=09Si=C3=A8ge social : 16 rue de la Ville l'=C3=89v=C3=AAque, 75008 PARI=
S</font></font></p>
      </span></td>
    </tr>
  </tbody>
</table>
</body>`,
		Subject: "The Subject of the message",
	}

	msg_html_error = objects.Message{
		Body_plain: "the plain body of the message",
		Body_html:  `<p>Links:</p><ul><li><a href="foo">Foo</a><li><a href="/bar/baz">BarBaz</a></ul>`,
		Subject:    "The Subject of the message",
	}

	msg_plain = objects.Message{
		Body_plain: "the plain body of the message",
		Subject:    "The Subject of the message",
	}

	msg_html_inlined = objects.Message{
		Body_html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title></title>
  <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    table {border-collapse: collapse !important;}
  </style>
  <![endif]-->
</head>
<body style="margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#ffffff;" >
  <center class="wrapper" style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" >
    <div class="webkit" style="max-width:600px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;" >
      <!--[if (gte mso 9)|(IE)]>
      <table width="600" align="center" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
      <tr>
      <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
      <![endif]-->
      <table class="outer" align="center" style="border-spacing:0;font-family:sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;" >
        <tr>
          <td class="full-width-image" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <img src="http://www.inbucket.org/email-assets/responsive/header.jpg" width="600" alt="" style="border-width:0;width:100%;max-width:600px;height:auto;" />
          </td>
        </tr>
        <tr>
          <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
              <tr>
                <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;text-align:left;" >
                  <p class="h1" style="Margin:0;font-weight:bold;font-size:14px;Margin-bottom:10px;" >Lorem ipsum dolor sit amet</p>
                    <p style="Margin:0;font-size:14px;Margin-bottom:10px;" >
                      Compare to:
                      <a href="http://tutsplus.github.io/creating-a-future-proof-responsive-email-without-media-queries/index.html" style="color:#ee6a56;text-decoration:underline;" >
                      tutsplus sample</a>
                    </p>

                    <p style="Margin:0;font-size:14px;Margin-bottom:10px;" >Copyright (c) 2015, Envato Tuts+<br/>
                    All rights reserved.</p>

                    <p style="Margin:0;font-size:14px;Margin-bottom:10px;" >Redistribution and use in source and binary forms, with or without
                    modification, are permitted provided that the following conditions are met:</p>

                    <ul>
                    <li>Redistributions of source code must retain the above copyright notice, this
                      list of conditions and the following disclaimer.</li>

                    <li>Redistributions in binary form must reproduce the above copyright notice,
                      this list of conditions and the following disclaimer in the documentation
                      and/or other materials provided with the distribution.</li>
                    </ul>

                    <p style="Margin:0;font-size:14px;Margin-bottom:10px;" >THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
                    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
                    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
                    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
                    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
                    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
                    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
                    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
                    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
                    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="two-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:center;font-size:0;" >
            <!--[if (gte mso 9)|(IE)]>
            <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
            <tr>
            <td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                    <table class="contents" style="border-spacing:0;font-family:sans-serif;color:#333333;width:100%;font-size:14px;text-align:left;" >
                      <tr>
                        <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
                          <img src="http://www.inbucket.org/email-assets/responsive/two-column-01.jpg" width="280" alt="" style="border-width:0;width:100%;max-width:280px;height:auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td class="text" style="padding-bottom:0;padding-right:0;padding-left:0;padding-top:10px;" >
                          Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                    <table class="contents" style="border-spacing:0;font-family:sans-serif;color:#333333;width:100%;font-size:14px;text-align:left;" >
                      <tr>
                        <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
                          <img src="http://www.inbucket.org/email-assets/responsive/two-column-02.jpg" width="280" alt="" style="border-width:0;width:100%;max-width:280px;height:auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td class="text" style="padding-bottom:0;padding-right:0;padding-left:0;padding-top:10px;" >
                          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas sed ante pellentesque, posuere leo id, eleifend dolor.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <tr>
          <td class="three-column" style="padding-right:0;padding-left:0;text-align:center;font-size:0;padding-top:10px;padding-bottom:10px;" >
            <!--[if (gte mso 9)|(IE)]>
            <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
            <tr>
            <td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                    <table class="contents" style="border-spacing:0;font-family:sans-serif;color:#333333;width:100%;font-size:14px;text-align:center;" >
                      <tr>
                        <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
                          <img src="http://www.inbucket.org/email-assets/responsive/three-column-01.jpg" width="180" alt="" style="border-width:0;width:100%;max-width:180px;height:auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td class="text" style="padding-bottom:0;padding-right:0;padding-left:0;padding-top:10px;" >
                          Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                    <table class="contents" style="border-spacing:0;font-family:sans-serif;color:#333333;width:100%;font-size:14px;text-align:center;" >
                      <tr>
                        <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
                          <img src="http://www.inbucket.org/email-assets/responsive/three-column-02.jpg" width="180" alt="" style="border-width:0;width:100%;max-width:180px;height:auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td class="text" style="padding-bottom:0;padding-right:0;padding-left:0;padding-top:10px;" >
                          Maecenas sed ante pellentesque, posuere leo id, eleifend dolor.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                    <table class="contents" style="border-spacing:0;font-family:sans-serif;color:#333333;width:100%;font-size:14px;text-align:center;" >
                      <tr>
                        <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
                          <img src="http://www.inbucket.org/email-assets/responsive/three-column-03.jpg" width="180" alt="" style="border-width:0;width:100%;max-width:180px;height:auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td class="text" style="padding-bottom:0;padding-right:0;padding-left:0;padding-top:10px;" >
                          Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <tr>
          <td class="three-column" style="padding-right:0;padding-left:0;text-align:center;font-size:0;padding-top:10px;padding-bottom:10px;" >
            <!--[if (gte mso 9)|(IE)]>
            <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
            <tr>
            <td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <p class="h2" style="Margin:0;font-size:18px;font-weight:bold;Margin-bottom:12px;" >Fashion</p>
                    <p style="Margin:0;" >Class eleifend aptent taciti sociosqu ad litora torquent conubia</p>
                    <p style="Margin:0;" ><a href="#" style="color:#ee6a56;text-decoration:underline;" >Read requirements</a></p>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <p class="h2" style="Margin:0;font-size:18px;font-weight:bold;Margin-bottom:12px;" >Photography</p>
                    <p style="Margin:0;" >Maecenas sed ante pellentesque, posuere leo id, eleifend dolor</p>
                    <p style="Margin:0;" ><a href="#" style="color:#ee6a56;text-decoration:underline;" >See examples</a></p>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <p class="h2" style="Margin:0;font-size:18px;font-weight:bold;Margin-bottom:12px;" >Design</p>
                    <p style="Margin:0;" >Class aptent taciti sociosqu eleifend ad litora per conubia nostra</p>
                    <p style="Margin:0;" ><a href="#" style="color:#ee6a56;text-decoration:underline;" >See the winners</a></p>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            <tr>
            <td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <p class="h2" style="Margin:0;font-size:18px;font-weight:bold;Margin-bottom:12px;" >Cooking</p>
                    <p style="Margin:0;" >Class aptent taciti eleifend sociosqu ad litora torquent conubia</p>
                    <p style="Margin:0;" ><a href="#" style="color:#ee6a56;text-decoration:underline;" >Read recipes</a></p>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <p class="h2" style="Margin:0;font-size:18px;font-weight:bold;Margin-bottom:12px;" >Woodworking</p>
                    <p style="Margin:0;" >Maecenas sed ante pellentesque, posuere leo id, eleifend dolor</p>
                    <p style="Margin:0;" ><a href="#" style="color:#ee6a56;text-decoration:underline;" >See examples</a></p>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="200" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <p class="h2" style="Margin:0;font-size:18px;font-weight:bold;Margin-bottom:12px;" >Craft</p>
                    <p style="Margin:0;" >Class aptent taciti sociosqu ad eleifend litora per conubia nostra</p>
                    <p style="Margin:0;" ><a href="#" style="color:#ee6a56;text-decoration:underline;" >Vote now</a></p>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <tr>
          <td class="left-sidebar" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:center;font-size:0;" >
            <!--[if (gte mso 9)|(IE)]>
            <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
            <tr>
            <td width="100" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column left" style="width:100%;display:inline-block;vertical-align:middle;max-width:100px;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                    <img src="http://www.inbucket.org/email-assets/responsive/sidebar-01.jpg" width="80" alt="" style="border-width:0;" />
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="500" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column right" style="width:100%;display:inline-block;vertical-align:middle;max-width:500px;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat. <a href="#" style="text-decoration:underline;color:#85ab70;" >Read&nbsp;on</a>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <tr>
          <td class="right-sidebar" dir="rtl" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:center;font-size:0;" >
            <!--[if (gte mso 9)|(IE)]>
            <table width="100%" dir="rtl" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
            <tr>
            <td width="100" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column left" dir="ltr" style="width:100%;display:inline-block;vertical-align:middle;max-width:100px;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    <img src="http://www.inbucket.org/email-assets/responsive/sidebar-02.jpg" width="80" alt="" style="border-width:0;" />
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td><td width="500" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
            <![endif]-->
            <div class="column right" dir="ltr" style="width:100%;display:inline-block;vertical-align:middle;max-width:500px;" >
              <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >
                <tr>
                  <td class="inner contents" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;text-align:center;" >
                    Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra. <a href="#" style="text-decoration:underline;color:#70bbd9;" >Per&nbsp;inceptos</a>
                  </td>
                </tr>
              </table>
            </div>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
      <!--[if (gte mso 9)|(IE)]>
      </td>
      </tr>
      </table>
      <![endif]-->
    </div>
  </center>
</body>
</html>`,
	}

	msg_html_issue_651 = objects.Message{
		Body_html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.=
w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr">
    <head>
        <title>Dev Tips</title>
        <meta http-equiv="Content-Type" content="text/html; charset=u=
tf-8">
        <meta name="viewport" content="width=device-width, initial-sc=
ale=1">
        <meta name="description" content="Dev Tips Email Forms">
        <meta name="keywords" content="Dev Tips">
       =20
    <style type="text/css">
=09=09body{
=09=09=09font:14px/20px 'Helvetica', Arial, sans-serif;
=09=09=09margin:0;
=09=09=09padding:75px 0 0 0;
=09=09=09text-align:center;
=09=09=09-webkit-text-size-adjust:none;
=09=09}
=09=09p{
=09=09=09padding:0 0 10px 0;
=09=09}
=09=09h1 img{
=09=09=09max-width:100%;
=09=09=09height:auto !important;
=09=09=09vertical-align:bottom;
=09=09}
=09=09h2{
=09=09=09font-size:22px;
=09=09=09line-height:28px;
=09=09=09margin:0 0 12px 0;
=09=09}
=09=09h3{
=09=09=09margin:0 0 12px 0;
=09=09}
=09=09.headerBar{
=09=09=09background:none;
=09=09=09padding:0;
=09=09=09border:none;
=09=09}
=09=09.wrapper{
=09=09=09width:600px;
=09=09=09margin:0 auto 10px auto;
=09=09=09text-align:left;
=09=09}
=09=09input.button{
=09=09=09border:none !important;
=09=09}
=09=09.button{
=09=09=09display:inline-block;
=09=09=09font-weight:500;
=09=09=09font-size:16px;
=09=09=09line-height:42px;
=09=09=09font-family:'Helvetica', Arial, sans-serif;
=09=09=09width:auto;
=09=09=09white-space:nowrap;
=09=09=09height:42px;
=09=09=09margin:12px 5px 12px 0;
=09=09=09padding:0 22px;
=09=09=09text-decoration:none;
=09=09=09text-align:center;
=09=09=09cursor:pointer;
=09=09=09border:0;
=09=09=09border-radius:3px;
=09=09=09vertical-align:top;
=09=09}
=09=09.button span{
=09=09=09display:inline;
=09=09=09font-family:'Helvetica', Arial, sans-serif;
=09=09=09text-decoration:none;
=09=09=09font-weight:500;
=09=09=09font-style:normal;
=09=09=09font-size:16px;
=09=09=09line-height:42px;
=09=09=09cursor:pointer;
=09=09=09border:none;
=09=09}
=09=09.rounded6{
=09=09=09border-radius:6px;
=09=09}
=09=09.poweredWrapper{
=09=09=09padding:20px 0;
=09=09=09width:560px;
=09=09=09margin:0 auto;
=09=09}
=09=09.poweredBy{
=09=09=09display:block;
=09=09}
=09=09span.or{
=09=09=09display:inline-block;
=09=09=09height:32px;
=09=09=09line-height:32px;
=09=09=09padding:0 5px;
=09=09=09margin:5px 5px 0 0;
=09=09}
=09=09.clear{
=09=09=09clear:both;
=09=09}
=09=09.profile-list{
=09=09=09display:block;
=09=09=09margin:15px 20px;
=09=09=09padding:0;
=09=09=09list-style:none;
=09=09=09border-top:1px solid #eee;
=09=09}
=09=09.profile-list li{
=09=09=09display:block;
=09=09=09margin:0;
=09=09=09padding:5px 0;
=09=09=09border-bottom:1px solid #eee;
=09=09}
=09=09html[dir=rtl] .wrapper,html[dir=rtl] .container,html[dir=rtl] l=
abel{
=09=09=09text-align:right !important;
=09=09}
=09=09html[dir=rtl] ul.interestgroup_field label{
=09=09=09padding:0;
=09=09}
=09=09html[dir=rtl] ul.interestgroup_field input{
=09=09=09margin-left:5px;
=09=09}
=09=09html[dir=rtl] .hidden-from-view{
=09=09=09right:-5000px;
=09=09=09left:auto;
=09=09}
=09=09body,#bodyTable{
=09=09=09background-color:#eeeeee;
=09=09}
=09=09h1{
=09=09=09font-size:28px;
=09=09=09line-height:110%;
=09=09=09margin-bottom:30px;
=09=09=09margin-top:0;
=09=09=09padding:0;
=09=09}
=09=09#templateContainer{
=09=09=09background-color:none;
=09=09}
=09=09#templateBody{
=09=09=09background-color:#ffffff;
=09=09}
=09=09.bodyContent{
=09=09=09line-height:150%;
=09=09=09font-family:Helvetica;
=09=09=09font-size:14px;
=09=09=09color:#333333;
=09=09=09padding:20px;
=09=09}
=09=09a:link,a:active,a:visited,a{
=09=09=09color:#336699;
=09=09}
=09=09.button:link,.button:active,.button:visited,.button,.button span{
=09=09=09background-color:#5d5d5d !important;
=09=09=09color:#ffffff !important;
=09=09}
=09=09.button:hover{
=09=09=09background-color:#444444 !important;
=09=09=09color:#ffffff !important;
=09=09}
=09=09label{
=09=09=09line-height:150%;
=09=09=09font-family:Helvetica;
=09=09=09font-size:16px;
=09=09=09color:#5d5d5d;
=09=09}
=09=09.field-group input,select,textarea,.dijitInputField{
=09=09=09font-family:Helvetica;
=09=09=09color:#5d5d5d !important;
=09=09}
=09=09.asterisk{
=09=09=09color:#cc6600;
=09=09=09font-size:20px;
=09=09}
=09=09label .asterisk{
=09=09=09visibility:hidden;
=09=09}
=09=09.indicates-required{
=09=09=09display:none;
=09=09}
=09=09.field-help{
=09=09=09color:#777;
=09=09}
=09=09.error,.errorText{
=09=09=09color:#e85c41;
=09=09=09font-weight:bold;
=09=09}
=09@media (max-width: 620px){
=09=09body{
=09=09=09width:100%;
=09=09=09-webkit-font-smoothing:antialiased;
=09=09=09padding:10px 0 0 0 !important;
=09=09=09min-width:300px !important;
=09=09}

}=09@media (max-width: 620px){
=09=09.wrapper,.poweredWrapper{
=09=09=09width:auto !important;
=09=09=09max-width:600px !important;
=09=09=09padding:0 10px;
=09=09}

}=09@media (max-width: 620px){
=09=09#templateContainer,#templateBody,#templateContainer table{
=09=09=09width:100% !important;
=09=09=09-moz-box-sizing:border-box;
=09=09=09-webkit-box-sizing:border-box;
=09=09=09box-sizing:border-box;
=09=09}

}=09@media (max-width: 620px){
=09=09.addressfield span{
=09=09=09width:auto;
=09=09=09float:none;
=09=09=09padding-right:0;
=09=09}

}=09@media (max-width: 620px){
=09=09.captcha{
=09=09=09width:auto;
=09=09=09float:none;
=09=09}

}</style></head>
    <body leftmargin="0" marginwidth="0" topmargin="0" marginheight=
="0" offset="0" style="font: 14px/20px 'Helvetica', Arial, sans-serif=
;margin: 0;padding: 75px 0 0 0;text-align: center;-webkit-text-size-adjust:=
 none;background-color: #eeeeee;">
    =09<center>
        =09<table border="0" cellpadding="20" cellspacing="0" height=
="100%" width="100%" id="bodyTable" style="background-color: #eeeee=
e;">
            =09<tr>
                =09<td align="center" valign="top">
                    =09<!-- // BEGIN CONTAINER -->
                        <table border="0" cellpadding="0" cellspacing=
="0" width="600" id="templateContainer" class="rounded6" style="b=
order-radius: 6px;background-color: none;">
                        =09<tr>
                            =09<td align="center" valign="top">
                                =09<!-- // BEGIN HEADER -->
                                    <table border="0" cellpadding="0" c=
ellspacing="0" width="600">
                                    =09<tr>
                                        =09<td>
                                            =09<h1 style="font-size: 28px=
;line-height: 110%;margin-bottom: 30px;margin-top: 0;padding: 0;">Thank you=
 for making Dev Tips Daily better!</h1>
                                            </td>
                                        </tr>
                                    </table>
                                =09<!-- END HEADER \\ -->
                                </td>
                            </tr>
                        =09<tr>
                            =09<td align="center" valign="top">
                                =09<!-- // BEGIN BODY -->
                                =09<table border="0" cellpadding="0" ce=
llspacing="0" width="600" id="templateBody" class="rounded6" style=
="border-radius: 6px;background-color: #ffffff;">
                                    =09<tr>
                                           =20
                                            <td align="left" valign="to=
p" class="bodyContent" style="line-height: 150%;font-family: Helvetica;=
font-size: 14px;color: #333333;padding: 20px;">
                                               =20
                                                <h2 style="font-size: 22p=
x;line-height: 28px;margin: 0 0 12px 0;">Please Confirm Subscription
</h2>
<a class="button" href="https://umaar.us9.list-manage.com/subscribe/con=
firm?u=2acb3bbbd6a2455edb2e65494&id=26bacd765c&e=f1a4ca74a7" style==
"color: #ffffff !important;display: inline-block;font-weight: 500;font-size=
: 16px;line-height: 42px;font-family: 'Helvetica', Arial, sans-serif;width:=
 auto;white-space: nowrap;height: 42px;margin: 12px 5px 12px 0;padding: 0 2=
2px;text-decoration: none;text-align: center;cursor: pointer;border: 0;bord=
er-radius: 3px;vertical-align: top;background-color: #5d5d5d !important;"><=
span style="display: inline;font-family: 'Helvetica', Arial, sans-serif;t=
ext-decoration: none;font-weight: 500;font-style: normal;font-size: 16px;li=
ne-height: 42px;cursor: pointer;border: none;background-color: #5d5d5d !imp=
ortant;color: #ffffff !important;">Yes, subscribe me to this list.</span></=
a>
<br>
<div><p style="padding: 0 0 10px 0;">If you received this email by mistak=
e, simply delete it. You won't be subscribed if you don't click the confirm=
ation link above.</p>
<p style="padding: 0 0 10px 0;">For questions about this list, please con=
tact:
<br><a href="mailto:umar.hansa@gmail.com" style="color: #336699;">umar.=
hansa@gmail.com</a></p>
</div>


<span itemscope itemtype="http://schema.org/EmailMessage">
  <span itemprop="description" content="We need to confirm your email a=
ddress."></span>
  <span itemprop="action" itemscope itemtype="http://schema.org/Confirm=
Action">
    <meta itemprop="name" content="Confirm Subscription">
    <span itemprop="handler" itemscope itemtype="http://schema.org/Http=
ActionHandler">
      <meta itemprop="url" content="https://umaar.us9.list-manage.com/s=
ubscribe/smartmail-confirm?u=2acb3bbbd6a2455edb2e65494&id=26bacd765c&e=
=f1a4ca74a7&inline=true">
      <link itemprop="method" href="http://schema.org/HttpRequestMethod=
/POST">
    </span>
  </span>
</span>


                                            </td>
                                           =20
                                        </tr>
                                    </table>
                                    <!-- END BODY \\ -->
                                </td>
                            </tr>
                        =09<tr>
                            =09<td align="center" valign="top">
                                =09<!-- // BEGIN FOOTER -->
                                =09<table border="0" cellpadding="20" c=
ellspacing="0" width="600">
                                    =09<tr>
                                        =09<td align="center" valign="t=
op">
                                               =20
                                                <div>
                                                    <span class="poweredB=
y" style="display: block;"><a href="http://www.mailchimp.com/monkey-rew=
ards/?utm_source=freemium_newsletter&utm_medium=email&utm_campaign=mo=
nkey_rewards&aid=2acb3bbbd6a2455edb2e65494&afl=1" style="color: #3366=
99;"><img src="https://cdn-images.mailchimp.com/monkey_rewards/MC_MonkeyR=
eward_15.png" border="0" alt="Email Marketing Powered by MailChimp" tit=
le="MailChimp Email Marketing" width="139" height="54"></a></span>
                                                </div>
                                               =20
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- END FOOTER \\ -->
                                </td>
                            </tr>
                        </table>
                        <!-- END CONTAINER \\ -->
                    </td>
                </tr>
            </table>
        </center>
    </body>
</html>`,
	}
)
