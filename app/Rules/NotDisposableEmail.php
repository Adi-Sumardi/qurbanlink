<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Block registration from known disposable / throwaway email providers.
 *
 * List dipilih dari yang paling sering dipakai bot/spam:
 * - mailinator, tempmail, guerrillamail, 10minutemail, throwaway, dll.
 *
 * Mau update list? Reference: https://github.com/disposable-email-domains/disposable-email-domains
 */
class NotDisposableEmail implements ValidationRule
{
    /**
     * Subset of most-used disposable domains. Cukup untuk filter 90%+ spam.
     */
    private const BLOCKED = [
        '0-mail.com', '10minutemail.com', '10minutemail.net', '20minutemail.com',
        '33mail.com', 'binkmail.com', 'bobmail.info', 'chammy.info', 'devnullmail.com',
        'discard.email', 'discardmail.com', 'dispostable.com', 'dropmail.me',
        'einrot.com', 'emailondeck.com', 'emailtemporanea.com', 'fakemailgenerator.com',
        'fakeinbox.com', 'filzmail.com', 'getairmail.com', 'getnada.com',
        'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
        'harakirimail.com', 'inboxbear.com', 'inboxkitten.com', 'jetable.org',
        'maildrop.cc', 'mailcatch.com', 'mailinator.com', 'mailinator.net', 'mailinator.org',
        'mailnesia.com', 'mailnull.com', 'mintemail.com', 'mohmal.com', 'mt2014.com',
        'mytemp.email', 'nada.email', 'no-spam.ws', 'nobulk.com', 'noclickemail.com',
        'one-time.email', 'onetimemail.com', 'onlinemail.live', 'openmailbox.org',
        'rcpt.at', 'sharklasers.com', 'spamavert.com', 'spamfree24.com', 'spamfree24.de',
        'spamfree24.org', 'spamgoes.in', 'spamthis.co.uk', 'spamthisplease.com',
        'tempinbox.com', 'tempmail.de', 'tempmail.it', 'tempmail.net', 'tempmail.us',
        'tempmail2.com', 'tempmailo.com', 'temp-mail.com', 'temp-mail.org', 'temp-mail.ru',
        'thetemporaryemail.com', 'throwam.com', 'throwawaymail.com', 'tmail.ws',
        'tmpmail.net', 'tmpmail.org', 'trashmail.com', 'trashmail.net', 'trashmail.de',
        'trashmail.io', 'tyldd.com', 'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org',
        'yopmail.com', 'yopmail.fr', 'yopmail.net', 'zetmail.com',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !str_contains($value, '@')) {
            return; // biar 'email' rule yang handle
        }

        $domain = strtolower(trim(substr(strrchr($value, '@'), 1)));

        if (in_array($domain, self::BLOCKED, true)) {
            $fail('Mohon gunakan email aktif (bukan email sekali pakai / disposable).');
        }
    }
}
