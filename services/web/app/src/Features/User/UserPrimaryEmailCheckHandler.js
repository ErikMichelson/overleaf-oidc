const Settings = require('@overleaf/settings')

function requiresPrimaryEmailCheck({
  email,
  emails,
  lastPrimaryEmailCheck,
  signUpDate,
}) {
  // we never require a check when using OIDC, as emails are retrieved from the OIDC provider
  if (process.env.OVERLEAF_OIDC_ISSUER !== undefined) {
    return false
  }

  const hasExpired = date => {
    if (!date) {
      return true
    }
    return Date.now() - date.getTime() > Settings.primary_email_check_expiration
  }

  const primaryEmailConfirmedAt = emails.find(
    emailEntry => emailEntry.email === email
  ).confirmedAt

  if (primaryEmailConfirmedAt && !hasExpired(primaryEmailConfirmedAt)) {
    return false
  }

  if (lastPrimaryEmailCheck) {
    return hasExpired(lastPrimaryEmailCheck)
  } else {
    return hasExpired(signUpDate)
  }
}

module.exports = {
  requiresPrimaryEmailCheck,
}
