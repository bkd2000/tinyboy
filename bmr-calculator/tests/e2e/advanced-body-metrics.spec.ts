import { test, expect } from '@playwright/test';

test.describe('Advanced Body Metrics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');
  });

  test('SMM (Skeletal Muscle Mass) - wyświetla się dla mężczyzny z pełnymi danymi', async ({ page }) => {
    // Wprowadź dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj body fat
    await page.click('button:has-text("Ręczne wprowadzenie")');
    await page.fill('input#bodyFatManual', '15');
    await page.waitForTimeout(500);

    // Sprawdź, czy SMM jest wyświetlane
    await expect(page.getByRole('heading', { name: /SMM/ })).toBeVisible();
    await expect(page.getByText('Skeletal Muscle Mass')).toBeVisible();

    // Sprawdź czy wartość jest wyświetlana
    await expect(page.locator('text=/\\d+\\.\\d+ kg/').first()).toBeVisible();

    // Sprawdź czy procent masy ciała jest wyświetlany
    await expect(page.getByText(/Procent masy ciała:/).first()).toBeVisible();
  });

  test('TBW (Total Body Water) - wyświetla się zawsze gdy są podstawowe dane', async ({ page }) => {
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(500);

    // Sprawdź, czy TBW jest wyświetlane
    await expect(page.getByRole('heading', { name: /TBW/ })).toBeVisible();
    await expect(page.getByText('Total Body Water')).toBeVisible();

    // Sprawdź czy wartość jest wyświetlana w litrach
    await expect(page.locator('text=/\\d+\\.\\d+ L/')).toBeVisible();

    // Sprawdź normy TBW
    await expect(page.getByText(/Normy TBW:/)).toBeVisible();
    await expect(page.getByText(/Mężczyźni: 55-65%/)).toBeVisible();
  });

  test('TBW - wyświetla prawidłowe normy dla kobiety', async ({ page }) => {
    await page.fill('input#weight', '65');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');
    await page.waitForTimeout(500);

    await expect(page.getByRole('heading', { name: /TBW/ })).toBeVisible();
    await expect(page.getByText(/Kobiety: 50-60%/)).toBeVisible();
  });

  test('Metabolic Age - wyświetla się z pełnymi danymi', async ({ page }) => {
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź, czy Wiek Metaboliczny jest wyświetlany
    await expect(page.getByRole('heading', { name: 'Wiek Metaboliczny' })).toBeVisible();

    // Sprawdź czy wiek rzeczywisty jest wyświetlany
    await expect(page.getByText(/Wiek rzeczywisty:/)).toBeVisible();

    // Sprawdź opis
    await expect(page.getByText(/Wiek metaboliczny pokazuje/)).toBeVisible();
  });

  test('Visceral Fat - NIE wyświetla się bez obwodu talii', async ({ page }) => {
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(500);

    // Tłuszcz trzewny nie powinien być wyświetlany bez obwodu talii
    await expect(page.getByRole('heading', { name: /Tłuszcz Trzewny/ })).not.toBeVisible();

    // Sprawdź czy jest informacja o dodaniu obwodu talii
    await expect(page.getByText(/Dodaj obwód talii/)).toBeVisible();
  });

  test('Visceral Fat - wyświetla się z obwodem talii', async ({ page }) => {
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#waist', '90');
    await page.waitForTimeout(1000);

    // Sprawdź, czy Tłuszcz Trzewny jest wyświetlany
    await expect(page.getByRole('heading', { name: /Tłuszcz Trzewny/ })).toBeVisible();
    await expect(page.getByText('Visceral Fat')).toBeVisible();
  });

  test('Visceral Fat - skala i kategorie', async ({ page }) => {
    await page.fill('input#weight', '85');
    await page.fill('input#height', '175');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#waist', '95');
    await page.waitForTimeout(1000);

    // Sprawdź legendę skali
    await expect(page.getByText(/Skala:/)).toBeVisible();
    await expect(page.getByText('1-59')).toBeVisible();
  });

  test('Wszystkie wskaźniki - wyświetlają się razem z pełnymi danymi', async ({ page }) => {
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj body fat dla SMM
    await page.click('button:has-text("Ręczne wprowadzenie")');
    await page.fill('input#bodyFatManual', '15');

    // Dodaj obwód talii dla Visceral Fat
    await page.fill('input#waist', '85');
    await page.waitForTimeout(1000);

    // Sprawdź tytuł sekcji
    await expect(page.getByText('Zaawansowane wskaźniki metaboliczne')).toBeVisible();

    // Sprawdź czy wszystkie 4 wskaźniki są widoczne
    await expect(page.getByRole('heading', { name: /SMM/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TBW/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wiek Metaboliczny' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tłuszcz Trzewny/ })).toBeVisible();

    // Sprawdź disclaimer
    await expect(page.getByText(/Wszystkie wskaźniki są szacunkowe/)).toBeVisible();

    await page.screenshot({ path: 'test-results/24-wszystkie-sekcje.png', fullPage: true });
  });

  test('Pełny workflow - od wagi do wszystkich wskaźników', async ({ page }) => {
    // Krok 1: Wprowadź podstawowe dane
    await page.fill('input#weight', '75');
    await expect(page.getByText(/Zaawansowane wskaźniki metaboliczne/)).not.toBeVisible();

    await page.fill('input#height', '175');
    await expect(page.getByText(/Zaawansowane wskaźniki metaboliczne/)).not.toBeVisible();

    await page.fill('input#age', '35');
    await expect(page.getByText(/Zaawansowane wskaźniki metaboliczne/)).not.toBeVisible();

    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Krok 2: Teraz wszystkie wskaźniki powinny być widoczne (SMM używa LBM, który nie wymaga body fat)
    await expect(page.getByText('Zaawansowane wskaźniki metaboliczne')).toBeVisible();
    await expect(page.getByRole('heading', { name: /TBW/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wiek Metaboliczny' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /SMM/ })).toBeVisible();

    // Krok 3: Dodaj body fat - wartości mogą się zmienić ale SMM już jest
    await page.click('button:has-text("Ręczne wprowadzenie")');
    await page.fill('input#bodyFatManual', '18');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: /SMM/ })).toBeVisible();

    // Krok 4: Dodaj obwód talii - pojawi się Visceral Fat
    await page.fill('input#waist', '88');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: /Tłuszcz Trzewny/ })).toBeVisible();

    // Wszystkie 4 wskaźniki powinny być teraz widoczne
    await expect(page.getByRole('heading', { name: /SMM/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TBW/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wiek Metaboliczny' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tłuszcz Trzewny/ })).toBeVisible();
  });

  test('Responsywność - mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.click('button:has-text("Ręczne wprowadzenie")');
    await page.fill('input#bodyFatManual', '15');
    await page.fill('input#waist', '85');
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja jest widoczna i responsywna
    await expect(page.getByText('Zaawansowane wskaźniki metaboliczne')).toBeVisible();
    await expect(page.getByRole('heading', { name: /SMM/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TBW/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wiek Metaboliczny' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tłuszcz Trzewny/ })).toBeVisible();
  });

  test('Footer - zaktualizowany z nowymi wskaźnikami', async ({ page }) => {
    await expect(page.getByText(/Zaawansowane wskaźniki:/)).toBeVisible();
    await expect(page.getByText(/SMM/)).toBeVisible();
    await expect(page.getByText(/TBW/)).toBeVisible();
    await expect(page.getByText(/Wiek Metaboliczny/)).toBeVisible();
    await expect(page.getByText(/Tłuszcz Trzewny/)).toBeVisible();
  });
});
