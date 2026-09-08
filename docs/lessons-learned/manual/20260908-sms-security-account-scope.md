# SMS security is account-scoped

- Partnership agreement is school-scoped in `afc-partnership-agreement`. SMS 2FA is account-scoped by email in `afc-sms-security` and does not reset on signup.
- Prototype verify code is `123456`, same mock as email verification. Failed verify must keep the mobile number and show the error on the code field.
