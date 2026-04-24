<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $email = urlencode($notifiable->getEmailForPasswordReset());
        $url = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'https://tawzii.id')), '/')
            . '/reset-password?token=' . $this->token . '&email=' . $email;

        return (new MailMessage)
            ->subject('Reset Kata Sandi — Tawzii Digital')
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Kami menerima permintaan untuk mereset kata sandi akun Tawzii Digital Anda.')
            ->action('Reset Kata Sandi', $url)
            ->line('Link ini akan kedaluwarsa dalam 60 menit.')
            ->line('Jika Anda tidak meminta reset kata sandi, abaikan email ini — akun Anda aman.')
            ->salutation('Salam, Tim Tawzii Digital');
    }
}
