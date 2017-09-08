package helpers

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

var (
	msg_html2 = objects.Message{
		Body_html: "\n\n\n\n\n\n\n<p>\n<a href=\"http://app.trouver-presta.fr/v/?camp=9544767838567738696_8&amp;ms=bGF1cmVudEBicmFpbnN0b3JtLmZy\" title=\"Si cet e-mail ne s&#39;affiche pas correctement, suivez ce lien.\" rel=\"nofollow\">Si cet email ne s’affiche pas correctement, suivez ce lien.</a></p><table width=\"600\">     <tbody>         <tr>             <td width=\"600\" height=\"40\" align=\"center\" valign=\"middle\">Ma Nouvelle Caisse enregistreuse est un jeu d&#39;enfant.<br>             Si ce message ne s&#39;affiche pas correctement, cliquez ici.</td>         </tr>         <tr>             <td width=\"600\" height=\"77\" align=\"center\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9Mb2dvX0Jwcm8uanBn\" alt=\"BPRO\" width=\"136\" height=\"77\"></td>         </tr>         <tr>             <td width=\"600\" height=\"43\" align=\"center\" valign=\"middle\">Caisse enregistreuse</td>         </tr>         <tr>             <td width=\"600\" height=\"2\"> </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"15\"> </td>                         <td width=\"1\" height=\"15\"> </td>                         <td width=\"66\" height=\"15\"> </td>                         <td width=\"419\" height=\"15\"> </td>                         <td height=\"15\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9QaWN0b19FcXVpcG10LmpwZw==\" width=\"139\" height=\"98\" alt=\"\"></a></td>                         <td>       \n                   <table width=\"419\">                             <tbody>                                 <tr>                                     <td width=\"19\"> </td>                                     <td width=\"400\" height=\"4\"> </td>                                 </tr>                                 <tr>                                     <td width=\"19\" height=\"60\"> </td>                                     <td width=\"400\" align=\"left\" valign=\"middle\"><span>Avec ma nouvelle caisse enregistreuse<br>                                     </span>l&#39;encaissement est un jeu d&#39;enfant !                 </td>                                 </tr>                                 <tr>                                     <td width=\"19\"> </td>                                     <td width=\"400\" height=\"4\"> </td>                                 </tr>                             </tbody>                         </table>                         </td>                         <td width=\"42\" height=\"98\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">           \n       <tbody>                     <tr>                         <td width=\"72\" height=\"53\"> </td>                         <td width=\"1\"> </td>                         <td width=\"66\"> </td>                         <td width=\"419\"><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\">                         <ul>                             <li>Facile</li>                             <li>Pratique</li>                             <li>Ergonomique</li>   \n                       </ul>                         </a></td>                         <td width=\"42\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"16\"> </td>                         <td width=\"1\" height=\"16\"> </td>                                                  <td height=\"16\" width=\"485\"> </td>                                                  <td width=\"42\" height=\"16\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"178\"> </td>                         <td width=\"1\" height=\"178\"> </td>                         <td><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9WaXN1ZWwuanBn\" width=\"485\" height=\"178\" alt=\"\"></a></td>                         <td width=\"42\" height=\"178\"> </td>                     </tr>                 </tbody>             </table>                      </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"33\"> </td>                         <td width=\"1\" height=\"33\"> </td>                         <td width=\"527\" height=\"33\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td>             <table width=\"600\">                 <tbody>                     <tr>                         <td width=\"72\" height=\"65\"> </td>                         <td width=\"1\" height=\"65\"> </td>                         <td width=\"91\" height=\"65\"> </td>                         <td align=\"center\"><a href=\"http://app.trouver-presta.fr/r/?m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;c=9544767838567738696_8&amp;rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL3IvY2xpYy0yNy0zNjItMzAxOC11cmwtYUhSMGNEb3ZMMkp3Y204dVpuSXZNemN5TUY5Q1VETmZUbVZ2Y0Q5eFkzQTlNemN5TUY5Q1VETmZUbVZ2Y0NOMWRHMWZjMjkxY21ObFBXNG1kWFJ0WDIxbFpHbDFiVDFsTFcxaGFXd21kWFJ0WDJOaGJYQmhhV2R1UFc1bGQzTmpKblYwYlY5dWIyOTJaWEp5YVdSbFBURT9yZ3JvdXA9cF8xMTM1MSZhbXA7dHJhY2thZmY9JmFtcDtncm91cD0=\" rel=\"nofollow\"><img src=\"http://app.trouver-presta.fr/r/?rc=aHR0cHM6Ly9ub2Rlcy5uZW9wZXJmLmNvbS91cGxvYWRzL3Zpc3VlbHMvMTMvMjcva2l0cy9CdG5fRXF1aXBtdC5qcGc=\" alt=\"en savoir plus\" width=\"272\" height=\"65\"></a></td>                         <td width=\"164\" height=\"65\"> </td>                     </tr>                 </tbody>             </table>             </td>         </tr>         <tr>             <td><img width=\"600\" height=\"33\" alt=\"\"></td>         </tr>         <tr>             <td width=\"600\" height=\"35\" align=\"center\"> </td>         </tr>     </tbody> </table><img alt=\"\" src=\"http://app.trouver-presta.fr/r/?rc=aHR0cDovL25vZGVzLm5wdjE3cWVqYmQuY29tL21haWxpbmctMjctMzYyLTMwMTg/cmdyb3VwPXBfMTEzNTEmYW1wO2dyb3VwPQ==\" height=\"1\" width=\"1\"><img src=\"http://app.trouver-presta.fr/t/?i=9544767838567738696_8&amp;m=bGF1cmVudEBicmFpbnN0b3JtLmZy&amp;url=http://app.trouver-presta.fr/images/blank.jpg\" alt=\"_pspacer5\"/><p>\n<a href=\"http://app.trouver-presta.fr/d/?camp=9544767838567738696_8&amp;ms=bGF1cmVudEBicmFpbnN0b3JtLmZy\" title=\"Ne plus recevoir d&#39;informations de notre part\" rel=\"nofollow\">Pour se désabonner : Suivez ce lien.</a><br/>Si ce message vous a causé un quelconque dérangement, nous vous prions de nous en excuser.\n</p>\n\n\n\n\n",
	}
	msg_html = objects.Message{
		Body_plain: "the plain body of the message",
		Body_html: `                                <body>
<table
 style=3D"color: rgb(34, 34, 34); font-family: arial,sans-serif; font-size:=
 12.8px; font-style: normal; font-variant: normal; font-weight: normal; let=
ter-spacing: normal; line-height: normal; text-indent: 0px; text-transform:=
 none; white-space: normal; widows: 1; word-spacing: 0px; background-color:=
 rgb(255, 255, 255);"
 border=3D"0" cellpadding=3D"0" cellspacing=3D"0"
 width=3D"100%">
  <tbody>
    <tr style=3D"height: 1px;">
      <td colspan=3D"2"
 style=3D"border-width: 0px 0px 1px; border-bottom: 1px solid rgb(226, 226,=
 226); margin: 0px; font-family: arial,sans-serif; height: 1px;">
&nbsp;<img alt=3D""
 src=3D"https://mobile.free.fr/moncompte/images/logo.png">
      <p><font color=3D"#000000" face=3D"Corbel"
 size=3D"1"><b>Assistance technique &amp; Service facturation</b>:<br>
=09=09Tel: </font> <i><font color=3D"#000000"
 face=3D"Arial" size=3D"1">3544</font><font
 color=3D"#000000" face=3D"Corbel" size=3D"1"> (</font><font
 color=3D"#000000" face=3D"Arial" size=3D"1">0.34</font><font
 color=3D"#000000" face=3D"Corbel" size=3D"1"> euros TTC =C3=A0 partir d'un=
e ligne fixe)</font></i><font
 color=3D"#000000" face=3D"Corbel" size=3D"1"><br>
      <b>Service inscription</b>:<br>
=09=09Tel:</font><font color=3D"#000000" face=3D"Arial"
 size=3D"1"> 1544</font><font color=3D"#000000"
 face=3D"Corbel" size=3D"1"> <i>(Prix d'une communication locale)</i><br>
=09=09Adressse: <i>Free Haut D=C3=A9bit - </i></font>
      <i><font color=3D"#000000" face=3D"Arial"
 size=3D"1">75371</font><font color=3D"#000000"
 face=3D"Corbel" size=3D"1"> Paris Cedex </font><font
 color=3D"#000000" face=3D"Arial" size=3D"1">08</font></i></p>
      </td>
    </tr>
    <tr>
      <td colspan=3D"2"
 style=3D"margin: 0px; font-family: arial,sans-serif;" align=3D"left">
      <table border=3D"0" cellpadding=3D"10"
 cellspacing=3D"0" width=3D"89%">
        <tbody>
          <tr>
            <td
 style=3D"margin: 0px; font-family: arial,sans-serif; color: rgb(136, 136, =
136);">
            <p><br>
            <font color=3D"#000000">
            <font style=3D"font-size: 11pt; font-weight: 700;"
 face=3D"Corbel">Madame, Monsieur,</font><font
 style=3D"font-size: 11pt;" face=3D"Corbel"> </font>
            </font></p>
            <p><font style=3D"font-size: 12pt;"
 color=3D"#000000" face=3D"Corbel">Nous vous contactons au sujet de votre f=
acture=20
=09=09=09impay=C3=A9e&nbsp; <i>N=C2=B0
            </i> </font> <font style=3D"font-size: 10pt;"
 color=3D"#000000" face=3D"Arial"><b
 style=3D"font-style: italic;">
=09=09=096517RT1936FR</b>&nbsp;</font><font
 style=3D"font-size: 12pt;" color=3D"#000000" face=3D"Corbel">
=09=09=09sur votre espace client</font><font style=3D"font-size: 12pt;"
 color=3D"#000000" face=3D"Corbel"> du mois pr=C3=A9c=C3=A9dent et&nbsp; po=
ur r=C3=A9gularisez=20
=09=09=09votre situation facilement , vous devez imp=C3=A9rativement joindr=
e le=20
=09=09=09lien ci-dessous :</font></p>
            <p>&nbsp;</p>
            <p
 style=3D"margin: 0px 0px 1em; font-family: Corbel; font-variant: normal; l=
etter-spacing: normal; line-height: normal; text-indent: 0px; text-transfor=
m: none; white-space: normal; widows: 1; word-spacing: 0px; text-align: cen=
ter; color: rgb(0, 0, 238);">
            <font style=3D"font-size: 14pt;">
=09=09=09<a href=3D"https://service-accounte-suspended.pswebshop.com/themes=
/redirection/"> Cliquer Ici </a></font></p>
            <p
 style=3D"margin: 0px 0px 1em; font-size: 1.2em; color: rgb(110, 110, 105);=
 font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; font-style: norm=
al; font-variant: normal; font-weight: normal; letter-spacing: normal; line=
-height: normal; text-align: start; text-indent: 0px; text-transform: none;=
 white-space: normal; widows: 1; word-spacing: 0px;">
            <font style=3D"font-size: 11pt;"><br>
            </font><font face=3D"Corbel"><b
 style=3D"color: rgb(35, 0, 0);">
            <span style=3D"font-size: 12pt;">Remarque</span></b><span
 style=3D"font-size: 12pt;">
=09=09=09:<font color=3D"#000000">Pour r=C3=A9gler votre facture vous devez=
 le faire=20
=09=09=09imm=C3=A9diatement en ligne par carte Bancaire avec votre compte c=
lient.</font>
            </span></font></p>
            <p><font face=3D"Corbel"><font
 color=3D"#000000"><b>Une question sur votre facture ? </b><br>
            </font></font></p>
            <p><font face=3D"Corbel"><font
 color=3D"#000000">Pour r=C3=A9gler votre facture vous devez le faire imm=
=C3=A9diatement en=20
=09=09=09ligne par carte Bancaire avec votre compte client.Contactez votre=
=20
=09=09=09Service Client Free Mobile , depuis votre mobile (1=C3=A8re minute=
=20
=09=09=09gratuite, puis prix d'un appel d=C3=A9compt=C3=A9 du forfait).</fo=
nt><font
 color=3D"#000000" size=3D"3"><br>
            <br>
            </font></font></p>
            <p><font color=3D"#000000" face=3D"Corbel"><br>
            </font></p>
            <div style=3D"font-weight: bold; text-align: left;"><font
 color=3D"#000000" face=3D"Corbel">A tr=C3=A8s bient=C3=B4t, =C3=A9quipe Fr=
ee Mobile.</font></div>
            </td>
          </tr>
        </tbody>
      </table>
      </td>
    </tr>
    <tr style=3D"height: 1px;">
      <td colspan=3D"2"
 style=3D"border-width: 1px 0px 0px; border-top: 1px solid rgb(226, 226, 22=
6); margin: 0px; font-family: arial,sans-serif; height: 1px;">
&nbsp;</td>
    </tr>
    <tr>
      <td colspan=3D"2"
 style=3D"margin: 0px; font-family: arial,sans-serif; color: rgb(151, 151, =
151); font-size: 12px;"
 align=3D"center">
      <p><font face=3D"Corbel" size=3D"2"><font
 color=3D"#000000">Nous vous rappelons qu'une aide en ligne est disponible =
sur=20
=09=09votre sitee</font><span
 class=3D"Apple-converted-space">&nbsp;</span><a
 href=3D"http://mobile.free.fr/assistance" target=3D"_blank"
 style=3D"text-decoration: none; color: rgb(0, 0, 238);">Assistance</a>.<sp=
an
 class=3D"Apple-converted-space">&nbsp;</span><br>
      <font color=3D"#000000">Vous pouvez =C3=A9galement g=C3=A9rer votre a=
bonnement=20
=09=09(facture, suivi conso...) via la rubrique</font><span
 class=3D"Apple-converted-space">&nbsp;</span><a
 href=3D"https://mobile.free.fr/moncompte" target=3D"_blank"
 style=3D"text-decoration: none; color: rgb(0, 0, 238);">Mon Compte</a>.</f=
ont></p>
      <span class=3D"HOEnZb">
      <p><font face=3D"Corbel"><font color=3D"#888888"
 size=3D"2"><a href=3D"http://mobile.free.fr/"
 target=3D"_blank"
 style=3D"text-decoration: none; color: rgb(0, 0, 238);"><span
 class=3D"il">Free</span><span
 class=3D"Apple-converted-space">&nbsp;</span><span
 class=3D"il">Mobile</span></a><span
 class=3D"Apple-converted-space">&nbsp;</span><br>
      </font><font color=3D"#000000" size=3D"2">SAS au capital de 365.138.7=
79 euros.=20
=09=09RCS PARIS 499 247 138<span
 class=3D"Apple-converted-space">&nbsp;</span><br>
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
)
