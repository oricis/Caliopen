module.exports={l:{"p":function(n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}},m:{"contact.address_type.work":"Professional","contact.address_type.home":"Personal","contact.address_type.other":"Other","contact.email_type.work":"Professional","contact.email_type.home":"Personal","contact.email_type.other":"Other","contact.primary":"Primary","contact.im_type.work":"Professional","contact.im_type.home":"Personal","contact.im_type.other":"Other","orga-details.job.desc-full":function(a){return[a("jobDesc")," at ",a("orgaName")," ",a("department")]},"contact.phone_type.work":"Work","contact.phone_type.home":"Home","contact.phone_type.other":"Other","remote_identity.fetch_method.from_now":"Only all messages from now","remote_identity.fetch_method.fetch_all":"All messages from now and the historical","remote_identity.feedback.loading_messages":"Loading your messages, please wait.","remote_identity.action.cancel":"Cancel","remote_identity.form.login.label":"Login:","remote_identity.form.password.label":"Password:","remote_identity.form.protocol.label":"Protocol:","remote_identity.form.incomming_mail_server.label":"Incoming mail server","remote_identity.form.port.label":"Port:","remote_identity.action.disconnect":"Disconnect","remote_identity.action.back":"Previous","remote_identity.action.next":"Next","remote_identity.action.finish":"Connect","remote_identity.form_legend":"Connect an email server","contact.im_type.netmeeting":"Netmeeting","contact.contact_details":"Contact details","contact.contact_organizations":"Professional","contact.contact_identities":"Social identity","contact.profile.name_not_set":"(N/A)","device.feedback.invalid_ip":"IP or subnet address is invalid.","device.type.desktop":"Desktop","device.type.laptop":"Laptop","device.type.smartphone":"Smartphone","device.type.tablet":"Tablet","device.location.type.unknown":"Unkown","device.location.type.home":"Home","device.location.type.work":"Work","device.location.type.public":"Public","device.form.locations.address.label":"IP or subnet mask","device.form.locations.type.label":"Connection location","device.manage_form.name.label":"Name:","device.manage_form.name.infotext":"This is the name which allows you to identify your device everywhere.","device.manage_form.type.label":"Type:","device.manage_form.type.infotext":"You can select the type of your device: smartphone, tablet, laptop or desktop.","device.manage_form.ips.label":"IP or subnet address","device.manage_form.ips.infotext":"Restrict the access of your account to certain IP addresses for this device. (e.g. 192.168.10 or 192.168.1.1/24 or 192.168.1.1-20)","device.action.save_changes":"Save modifications","device.info.date_insert":"Insert date","device.info.last_seen":"Last connection","device.info.os":"Operating System","device.info.os-version":"Version","device.action.revoke":"Revoke this device","device.action.verify":"Verify this device","device.verify.not-you":"It's not you?","device.action.delete":"Delete","device.manage.title":"Manage Your device","device.manage.descr":"Here you can manage your device allowed to connect to your Caliopen account, set restrictions on some IP addresses and custom the name of your device to better identify it later.","device.info.title":"Device informations","device.revoke.title":"Revoke this device","device.revoke.descr":"Please be careful about this section! This operation will delete this device which will be unable to access to your Caliopen account in the future.","device.verify.title":"Verify you device","device.verify.descr":"You need to verify this device to allow it to access to your Caliopen account. Please note that this action can have an impact on your Privacy Index according to the device information and settings. You'll find below some informations about the device which tried to connect to your Caliopen account.","messages.compose.form.body.label":"Type your message here...","messages.compose.form.body.placeholder":"Type your message here...","message-list.message.action.tags":"Tags","message-list.message.action.delete":"Delete","message-list.message.protocol.email":"email","message-list.message.by":function(a){return["by ",a("0")]},"message-list.message.action.expand":"Expand","message-list.message.action.collapse":"Collapse","message-list.message.action.reply":"Reply","message-list.message.action.copy-to":"Copy to","message-list.message.action.mark_as_read":"Mark as read","message-list.message.action.mark_as_unread":"Mark as unread","message-list.action.reply":"Reply","message-list.action.delete":"Delete","reply-form.protocol.email":"email","reply-form.by":function(a){return["by ",a("0")]},"reply-form.you":"You","reply-form.now":"Now","messages.compose.form.subject.label":"Subject","messages.compose.action.send":"Send","messages.compose.action.save":"Save","openpgp.status.invalid":"Invalid","openpgp.status.expired":"Expired","openpgp.status.revoked":"Revoked","openpgp.status.valid":"Valid","openpgp.status.no_self_cert":"No self cert","openpgp.action.toggle-details":"Toggle details","openpgp.action.remove-key":"Remove","openpgp.details.identities":"Identities","openpgp.details.algorithm":"Algorithm","openpgp.details.key-size":"Key size","openpgp.details.status":"Status","openpgp.details.creation":"Creation","openpgp.details.expiration":"Expiration","openpgp.public-key":"Public key","openpgp.private-key":"Private key","messages.compose.action.remove-recipient":"Remove recipient","messages.compose.form.to.label":"To","reply-form.in-reply-to":function(a){return["In reply to: ",a("0")]},"messages.compose.action.copy":"Copy to","tags.action.remove":"Remove","tags.form.search.label":"Search","tags.form.search.placeholder":"Search a tag ...","tags.action.add":"Add","tags.action.create":"Create","collection-field-group.action.add":"Add","input-file.add_a_file.label":"Add a file","input-file-group.file.size":function(a){return[a("0")," kB"]},"input-file-group.error.file_is_required":"A file is required","input-file-group.error.no_valid_ext":function(a){return["Only files ",a("0")]},"input-file-group.error.max_size":function(a){return["The file size must be under ",a("0")," ko"]},"password_strength.feedback.weak":"Strength: weak","password_strength.feedback.moderate":"Strength: moderate","password_strength.feedback.strong":"Strength: strong","call-to-action.action.compose":"Compose","call-to-action.action.compose_contact":"Compose to this contact","call-to-action.action.create_contact":"Create a contact","call-to-action.action.reply":"Reply","header.menu.search":"Search","header.menu.account":"Account","header.menu.settings":"Settings","header.menu.signout":"Signout","header.menu.signin":"Signin","header.menu.toggle-navigation":"Toggle navigation","header.menu.toggle-search-form":"Toggle search form","application_switcher.action.choose":"Choose","navigation.actions.toggle-timeline-filter":"Toggle timeline filters","navigation.actions.toggle-importance-level-slider":"Toggle Importance Level selection","timeline-filter.label":"Timeline filter","{0}":function(a){return[a("0")]},"take-a-tour.step.intro.title":"Welcome!","take-a-tour.step.intro.content":"<p>With using  Caliopen, you can access to all of your private messages (Email, and more to come) through a single login.</p><p>Now, take a look at our main features, such as unified message management, intuitive search and more!</p>","take-a-tour.step.search.title":"Intuitive search","take-a-tour.step.search.content":"<p>Every search can include filters. All of the unencrypted data can be searched.</p><p>Here you can search everything in your messages and contacts.</p>","take-a-tour.step.user-menu.title":"Account menu","take-a-tour.step.user-menu.content":"<p>Keep up-to-date your account information and manage your settings from here!</p><p>Customize your application in your settings.</p>","take-a-tour.step.call-to-action.title":"Create quickly","take-a-tour.step.call-to-action.content":"<p>Create on the fly a new message or a new contact.</p><p>All you need to begin is here.</p>","take-a-tour.step.importance-slider.title":"Importance level","take-a-tour.step.importance-slider.content":"<p>This slider will help you to hide or show some messages depending on their importance level.</p><p>Lower the top slider to show only spams or upper the bottom one to show direct messages.</p>","take-a-tour.action.toggle":"Take a tour","take-a-tour.current-step":function(a){return["Take a tour (",a("current")," of ",a("total"),")"]},"take-a-tour.action.skip":"Skip","take-a-tour.action.prev":"Previous","take-a-tour.action.next":"Next","take-a-tour.action.last-step":"Finish","take-a-tour.action.close":"Close","timeline-filter.options.all":"All","timeline-filter.options.received":"Received","timeline-filter.options.sent":"Sent","timeline-filter.options.draft":"Drafts","alpha.footer.feedback":"Tell us if something went wrong at <a href=\"https://feedback.caliopen.org/\">https://feedback.caliopen.org/</a>.","search-results.all":function(a){return["All (",a("total"),")"]},"search-results.messages":function(a){return["Messages (",a("nbMessages"),")"]},"search-results.contacts":function(a){return["Contacts (",a("nbContacts"),")"]},"settings.application":"Application","user.security":"Security","tags.label.important":"Important","tags.label.inbox":"Inbox","tags.label.spam":"Spam","user.route.label.default":"Account","user.route.label.profile":"Profile","user.route.label.privacy":"Privacy","user.route.label.security":"Security","settings.route.label.default":"Settings","settings.route.label.application":"Application","settings.contact.display_format.options.first_last":"Firstname, Lastname","settings.contact.display_format.options.last_first":"Lastname, Firstname","settings.contact.display_order_by.options.firstname":"Firstname","settings.contact.display_order_by.options.lastname":"Lastname","settings.contacts.display.label":"Display","settings.contacts.order.label":"Order by","settings.desktop_notification.feedback.enabled":"Desktop notifications are enabled","settings.desktop_notification.no_support":"Notifications are not supported by your browser","settings.desktop_notification.desktop_notifications_enabled":"Desktop notifications enabled","settings.desktop_notification.action.test_desktop_notification":"Check desktop notifications","settings.desktop_notification.disabled":"Notifications are disabled, please check your browser settings","settings.desktop_notification.action.request-desktop_notification_permission":"Enable desktop notifications","settings.interface.language.options.fr":"French","settings.interface.language.options.en":"English","settings.interface.language.options.de":"German","settings.interface.language.label":"Language","settings.message.display_format.options.rich_text":"Rich text","settings.message.display_format.options.plain_text":"Plain text","settings.message.display_format.label":"Display","settings.notification.message_preview.options.off":"Off","settings.notification.message_preview.options.always":"Always","settings.notification.delay_disappear.options.second":function(a){return[a("0")," Seconds"]},"settings.notification.enabled.label":"Enabled","settings.notification.message_preview.label":"Messages preview","settings.notification.sound_enabled.label":"Sounds enabled","settings.notification.delay_disappear.label":"Display delay","settings.interface.title":"Customize your interface","settings.message.title":"Messages settings","settings.contact.title":"Contact settings","settings.notification.title":"Notifications settings","settings.desktop_notification.title":"Desktop notifications","settings.presentation.update.action":"Save settings","contact.form-selector.email_form.label":"Email","contact.form-selector.phone_form.label":"Phone","contact.form-selector.im_form.label":"IM","contact.form-selector.address_form.label":"Address","contact.form-selector.add_new_field.label":"Add a new field","contact.action.add_new_field":"Add new","contact.address_form.legend":"Postal address","contact.address_form.street.label":"Street","contact.address_form.postal_code.label":"Postal code","contact.address_form.city.label":"City","contact.address_form.country.label":"Country","contact.address_form.select_country":"Select a country","contact.address_form.region.label":"Region","contact.address_form.select_region":"Select a region","contact.address_form.type.label":"Type","contact.email_form.legend":"Email","contact_profile.form.birthday.label":"Birthday","contact_profile.action.edit_contact":"Edit","contact_profile.form.name-prefix.label":"Prefix","contact_profile.form.firstname.label":"Firstname","contact_profile.form.lastname.label":"Lastname","contact_profile.form.name-suffix.label":"Suffix","contact_profile.form.title.label":"Title","contact.email_form.type.label":"Type","contact.email_form.address.label":"Address","contact.identity_form.legend":"Identities","contact.identity_form.service.label":"Service","contact.identity_form.identity.label":"Identity","contact.im_form.legend":"Instant messaging","contact.im_form.type.label":"Type","contact.im_form.address.label":"Address","contact.orga_form.legend":"Organization","contact.orga_form.label.label":"Label","contact.orga_form.name.label":"Name","contact.orga_form.title.label":"Title","contact.orga_form.department.label":"Department","contact.orga_form.job_description.label":"Job","contact.phone_form.legend":"Phone","contact.phone_form.type.label":"Type","contact.phone_form.number.label":"Number","contact.feedback.unable_to_save":"Unable to save the contact","tags.header.title":function(a){return["Tags <0>(Total: ",a("nb"),")</0>"]},"tags.header.label":"Tags","contact.action.cancel_edit":"Cancel","contact.edit_contact.title":"Edit contact","contact.action.validate_edit":"Validate","contact.action.edit_contact":"Edit contact","contact.action.edit_tags":"Edit tags","contact.action.delete_contact":"Delete","contacts-filters.order-by.label":"Order by","import-contact.feedback.successfull":"Contacts successfully imported","import-contact.feedback.error-file":"This file cannot be used to import contacts","import-contact.feedback.error-contact":"The file is valid but new contacts cannot be created","import-contact.feedback.unexpected-error":"An unexpected error occured.","general.action.cancel":"Cancel","import-contact.action.import":"Import","import-contact.form.button.close":"Close","import-contact.form.descr":"You can import one .vcf or .vcard file.","import-contact.form.success":"Successfuly imported !","tag_list.all_contacts":"All contacts","import-contact.action.import_contacts":"Import contacts","header.menu.contacts":"Contacts","general.action.load_more":"Load more","device.no-selected-device":"No selected device","password.forgot-form.title":"Forgot password","password.forgot-form.success":"Done! You will receive an email shortly with instructions to reset your password.","password.forgot-form.action.login":"Ok","password.forgot-form.instructions":"Enter your username and we'll email instructions on how to reset your password.","password.forgot-form.username.label":"Username","password.forgot-form.username.placeholder":"username","password.forgot-form.recovery_email.label":"Recovery email","password.forgot-form.recovery_email.placeholder":"example@domain.tld","password.forgot-form.action.send":"Send","password.forgot-form.cancel":"Cancel","passwords.form.error.identifiants_mismatch":"Identifiers don't match.","passwords.form.error.user_not_found":"User not found.","passwords.form.error.empty":"At least one field is required.","draft.feedback.saved":"Draft saved","page_not_found.title":"Page not found","password.form.new_password_confirmation.error":"Passwords does not match","password.reset-form.success":"Done!","reset-password.form.errors.token_not_found":"Token is no more valid. Please retry.","password.form.new_password.label":"New password:","password.form.new_password.placeholder":"Password","password.form.new_password_confirmation.label":"New password confirmation:","password.form.new_password_confirmation.placeholder":"Password","password.form.action.validate":"Apply modifications","password.reset-form.title":"Reset your password","password.action.go_signin":"Signin","timeline.draft-prefix":"Draft in progress:","search-results.preview.nb-messages":function(a){return[a("0")," messages contains \"",a("1"),"\" in their subject or content:"]},"search-results.actions.display-all":"Display all","search-results.preview.nb-contacts":function(a){return[a("0")," contacts contains \"",a("1"),"\" in their label or profile:"]},"settings.signature.label":"Signature","settings.signature.update.action":"Save","settings.signatures.title":"Update your signature","signin.title":"Please Log In","signup.limited_registration":"During alpha phase, signup is limited. Please register at <a href=\"https://welcome.caliopen.org\">https://welcome.caliopen.org</a>.","signin.form.username.label":"Username:","signin.form.username.placeholder":"username","signin.form.password.label":"Password:","signin.form.password.placeholder":"password","signin.action.login":"Login","signin.action.forgot_password":"Forgot password?","signin.feedback.required_username":"A username is required","signin.feedback.required_password":"A password is required","signin.feedback.invalid":"Credentials are invalid","signup.privacy.modal.label":"About Piwik","signup.privacy.modal.title":"Caliopen is under development !","signup.privacy.modal.text.alpha_tester":"As an alpha-tester your contribution is precious and will allow us to finalize Caliopen.","signup.privacy.modal.text.get_data":"For this purpose, you grant us the right to collect data related to your usage (displayed pages, timings, clics, scrolls ...almost everything that can be collected!).","signup.privacy.modal.text.desactivate_dnt":"You need to deactivate the DoNotTrack setting from your browser preferences (more informations at http://donottrack.us), as well as allowing cookies.","signup.privacy.modal.text.piwik":"We use https://piwik.org/ the open-source analytics plateform. The collected data will not be disclosed to any third party, and will stay scoped to Caliopen's alpha testing purpose.","signup.privacy.modal.close":"Ok got it !","signup.title":"Create your account","signup.form.username.label":"Username:","signup.form.username.placeholder":"username","signup.form.password.label":"Password:","signup.form.password.placeholder":"password","signup.form.invitation_email.label":"Please fill with the email provided when you requested an invitation.","signup.form.invitation_email.placeholder":"Invitation email","signup.form.privacy.title":"Privacy policy","signup.form.privacy.intro":"Throughout the development phase, we collect some data (but no more than the NSA).","signup.form.privacy.more_info":"More info","signup.form.privacy.checkbox.label":"I understand and agree","signup.action.create":"Create","signup.go_signin":"I already have an account","signup.feedback.username_starting_ending_dot":"The username cannot start or end with a dot (.)","signup.feedback.username_length":"The length of the username must be be between 3 and 42","signup.feedback.username_double_dots":"The username cannot contain two dots (.) next to the other","signup.feedback.required_privacy":"We need your privacy policy agreement","signup.feedback.required_tos":"We need your terms and conditions agreement","signup.feedback.invalid":"Credentials are invalid","signup.feedback.required_username":"A username is required","signup.feedback.username_invalid_characters":function(a){return["The username cannot contain some special characters like ",a("0")," and space"]},"signup.feedback.required_password":"A password is required","signup.feedback.unavailable_username":"We are sorry, this username is not available","signup.feedback.invalid_recovery_email":"The email should be valid","signup.feedback.required_recovery_email":"A backup email is required","message-item.action.delete":"Delete","message-item.action.reply":"Reply","message-item.action.manage_tags":"Manage tags","header.menu.discussions":"Messages","user.privacy.improve_pi":"Improve your privacy index","user.profile.form.avatar.label":"Avatar","user.profile.form.username.label":"Username","user.profile.form.given_name.label":"Given name","user.profile.form.family_name.label":"Family name","user.profile.form.email.label":"Email","user.profile.form.recovery_email.label":"Recovery email","user.action.update":"Update","user.profile.subscribed_date":"Subscribed on","user.action.improve_rank":"Improve rank","user.action.cancel_edit":"Cancel","user.action.edit_profile":"Edit","user.action.share_profile":"Share","user.profile.form.title":"Complete your profile","login.details.title":"Login:","login.details.label":"login","openpgp.feedback.unable-read-public-key":"Unable to read public key","openpgp.feedback.unable-read-private-key":"Unable to read private key","openpgp.feedback.fingerprints-not-match":"Fingerprints do not match","user.openpgp.action.switch-generate-key":"Generate key","user.openpgp.action.switch-import-raw-key":"Import key","user.openpgp.form.email.label":"Email","user.openpgp.has-passphrase":"Enable passphrase","user.openpgp.form.passphrase.label":"Passphrase","user.openpgp.action.create":"Create","user.openpgp.form.public-key.label":"Public key","user.openpgp.form.private-key.label":"Private key","user.openpgp.action.add":"Add","user.openpgp.action.edit-keys":"Edit and add keys","password.details.password_strength.title":"Password strength:","password.details.action.change":"Change","password.form.current_password.label":"Current password:","password.form.current_password.placeholder":"Enter your current password","password.form.current_password.tip":"The password you want to replace.","password.form.new_password.tip":"The password you want to use from now.","password.form.action.cancel":"Cancel","password.form.feedback.successfull":"Password updated!","password.form.feedback.error-old-password":"Wrong old password.","password.form.feedback.unexpected-error":"Error when updating password.","user.security.section_password.title":"Password","auth.feedback.deauth":"You are not authenticated anymore. Please reconnect.","compose.route.label":"Compose","contact.action.share_contact":"Share","contacts-filters.format-view.firstname":"Firstname, Lastname","contacts-filters.format-view.label":"Format name view","contacts-filters.format-view.name":"Lastname, Firstname","login.details.action.change":"Change your login","message-list.action.copy-to":"Copy to","message.feedbak.update_fail":"Update failed","new-contact.route.label":"New contact","password.form.tfa.label":"TOTP validation code:","password.form.tfa.placeholder":"Enter the 2-auth code","password.form.tfa.tip":"Only if you have enabled the 2-Factor Authentification method.","search-results.route.label":"Results for: %(term)s","settings.identities":"Identities","settings.route.label.identities":"Identities","settings.route.label.signatures":"Signatures","settings.route.label.tags":"Tags","settings.signatures":"Signatures","settings.tags":"Tags","signin.create_an_account":"Create an account","signup.form.recovery_email.label":"Backup email address","signup.form.recovery_email.placeholder":"Backup email address","signup.form.tos.label":"I agree Terms and conditions","user.privacy":"Privacy","user.profile":"Profile","user.security.section_pgpkeys.title":"PGP private keys","user.security.section_tfa.title":"Two-factor authentication"}};
