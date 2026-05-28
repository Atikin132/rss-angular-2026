# Sprint 2: Login Page - 2026-05-28

## Что было сделано

Сегодня занимался страницей логина и вынес auth роуты в отдельный routes.ts внутри feature/auth. До этого все роуты были в app.routes.ts и файл уже начинал разрастаться.

Сделал login page с email/password формой, remember me, forgot password, переключением видимости пароля и навигацией после логина.

Также подключил Angular Material и немного привёл страницу к более нормальному виду.

## Проблемы

Долго не мог понять, почему кнопка Login не становилась активной, хотя форма уже была valid.

Сначала сделал disabled через computed(() => this.loginForm.invalid), но потом выяснилось, что computed не отслеживает изменения FormGroup автоматически.

В итоге убрал computed и сделал disabled напрямую через loginForm.invalid.

## Что я узнал

Лучше понял:

- как организовывать feature routes;
- как работают Reactive Forms;
- как использовать signal() для UI состояния;
- как работает ngSubmit;
- зачем используют void перед router.navigate().

## Планы

Следующим этапом планирую сделать register page, а после этого wildcard route и route guards.

## Затраченное время

5 часов
