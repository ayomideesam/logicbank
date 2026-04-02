# Angular 19.2.20 Development Standards
**LogicBank — Digital Account Maintenance Portal**  
**Last Updated:** April 2, 2026  
**Angular Version:** 19.2.20 | **CLI:** 19.2.20 | **TypeScript:** 5.6.2

---

## 📌 Purpose
This document is the **single source of truth** for modern Angular development patterns in this project. All code changes, fixes, and features must reference and follow these standards. When Angular version changes in `package.json`, this file must be updated accordingly.

**Referenced in PRs/Commits as:** "See ANGULAR-19-STANDARDS.md - [pattern name]"

---

## 🎯 Core Principles
1. **Signals over RxJS** — Faster, simpler, no subscription overhead
2. **Type Safety** — Strict mode enabled (`noImplicitAny`, `strictNullChecks`). `any` is forbidden.
3. **Zero Boilerplate** — Modern control flow, DI via `inject()`
4. **Performance First** — Computed properties, effect tracking, automatic change detection
5. **Standalone First** — All components are standalone. No `NgModule`, no `CommonModule`.
6. **Thin Components** — Components handle only UI logic. Data, business rules, and heavy state live in services.

---

## 🚀 STATE MANAGEMENT: Signals vs BehaviorSubject

### ❌ OLD PATTERN (BehaviorSubject)
```typescript
// Slow, subscription overhead, verbose
private state = new BehaviorSubject<MyState>({ ... });
public state$ = this.state.asObservable();

// In component
this.myService.state$.subscribe(state => {
  this.localState = state;  // Manual subscription
});
```
**Issues:** Memory leaks, boilerplate, change detection overhead, requires `.value` access

---

### ✅ NEW PATTERN (Signals)
```typescript
// Fast, zero overhead, automatic
private state = signal<MyState>({ ... });
public state = signal<MyState>({ ... }); // expose directly or via computed()

// In component - automatic updates, no subscription needed
state = inject(MyService).state;  // Direct access
```
**Benefits:** 10-30% faster, no subscription management, automatic change detection, type-safe

---

## 📊 Signal Patterns Reference

### 1️⃣ Writing State
```typescript
// Service
import { signal, computed, effect, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MyService {
  // Private state signal
  private itemsSignal = signal<Item[]>([]);
  
  // Public computed (read-only)
  public items = computed(() => this.itemsSignal());
  public itemCount = computed(() => this.itemsSignal().length);
  
  // Update state
  updateItems(items: Item[]): void {
    this.itemsSignal.set(items);
    // OR for immutable update:
    // this.itemsSignal.update(prev => [...prev, newItem]);
  }
}
```

### 2️⃣ Reading State in Components
```typescript
// Component
export class MyComponent {
  private myService = inject(MyService);
  
  // Direct signal access (auto-updates)
  items = this.myService.items;
  itemCount = this.myService.itemCount;
  
  // In template: {{ items().length }} or {{ itemCount() }}
}
```

### 3️⃣ Derived State with Computed
```typescript
private user = signal<User | null>(null);
private permissions = signal<Permission[]>([]);

// Computed automatically updates when dependencies change
public canEdit = computed(() => {
  const user = this.user();
  const perms = this.permissions();
  return user && perms.includes('EDIT');
});
```

### 4️⃣ Side Effects with Effect
```typescript
// Auto-run when dependency changes (replaces subscriptions)
effect(() => {
  const user = this.user();
  if (user) {
    console.log('User changed:', user);
    this.loadUserData(user.id);
  }
});
```

---

## 🔗 DEPENDENCY INJECTION Pattern

### ❌ OLD (Constructor DI)
```typescript
constructor(private http: HttpClient, private router: Router) { }
```

### ✅ NEW (inject() Pattern)
```typescript
private http = inject(HttpClient);
private router = inject(Router);
```
**Benefits:** Cleaner, works in any function, tree-shakeable, better for standalone

---

## 🌐 HTTP PATTERNS

### ⚠️ RxJS HttpClient (Legacy but still used)
```typescript
// If using RxJS-based HTTP (temporary, being phased out)
initiateDisbursement(id: string): Observable<ApiResponse> {
  return this.http.get<ApiResponse>(`/api/facility/${id}`);
}

// In component
this.myService.getData().pipe(
  takeUntil(this.unSubscribe),
  finalize(() => this.isLoading = false)
).subscribe({
  next: (data) => { /* handle */ },
  error: (error) => { /* handle */ }
});
```

### ✅ MODERN: httpResource API (Angular 19.2+)
**Status:** Experimental in 19.2 but recommended for new code

```typescript
// Service
import { resource } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MyService {
  private http = inject(HttpClient);
  
  // httpResource automatically handles loading/error states
  getData = resource({
    request: ({ id }: { id: string }) => ({ id }),
    loader: ({ request }) => this.http.get(`/api/data/${request.id}`)
  });
}

// Component - simpler, no subscription management
export class MyComponent {
  service = inject(MyService);
  data = this.service.getData;
  
  loadData(id: string) {
    this.data.reload({ request: { id } });
  }
  
  // Template: {{ data.value() | json }}
  // Template: @if(data.isLoading()) { <spinner/> }
  // Template: @if(data.error()) { Error: {{ data.error().message }} }
}
```

### 📋 HTTP Pattern Decision Tree
- **Simple read operations** → Use `httpResource`
- **Complex workflows** → Use `rxjs + HttpClient` with proper cleanup
- **Legacy code** → Keep `HttpClient` subscriptions but add to unsubscribe management

---

## 🎮 CONTROL FLOW Patterns

### ❌ OLD (Structural Directives)
```html
<div *ngIf="isLoading">Loading...</div>
<div *ngFor="let item of items">{{ item.name }}</div>
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">Active</div>
</div>
```

### ✅ NEW (Control Flow Blocks)
```html
@if (isLoading()) {
  <div>Loading...</div>
}

@for (let item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

@switch (status()) {
  @case ('active') {
    <div>Active</div>
  }
  @case ('inactive') {
    <div>Inactive</div>
  }
}

@empty {
  <div>No items</div>
}
```
**Benefits:** Faster, ergonomic, default strict null checking

---

## 🔄 LIFECYCLE & CLEANUP

### Pattern: DestroyRef (Angular 19 preferred)
```typescript
// ✅ PREFERRED: Use takeUntilDestroyed from @angular/core/rxjs-interop
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.myService.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => { /* handle */ });
  }
}
```

### Pattern: Manual cleanup (if not using takeUntilDestroyed)
```typescript
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.observable$
      .pipe(takeUntil(this.destroy$))
      .subscribe(/* ... */);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

> ❌ **REMOVED:** `SubscriptionManagementDirective` — not part of this project.

---

## 💾 FORM STATE Management

### ✅ Reactive Forms (project standard for all forms)
```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export class MyFormComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(10)]],
    nin:           ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    const { accountNumber, nin } = this.form.getRawValue();
    // submit logic
  }
}
```
**Template:**
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="accountNumber" />
  @if (form.get('accountNumber')?.invalid && form.get('accountNumber')?.touched) {
    <span class="error">Account number is required</span>
  }
</form>
```

### Simple UI-only state (non-form signals)
```typescript
// OK for toggle/UI state only — not for form field values
isSearchActive = signal(false);
isLoading = signal(false);
```

---

## 🔒 SAFE HTML / DomSanitizer Pattern

When SVG, HTML markup, or trusted external content must be bound via `[innerHTML]`:

### ✅ Sanitize once in the service — expose as SafeHtml
```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MyDataService {
  private sanitizer = inject(DomSanitizer);

  private safe(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // Model stores SafeHtml — never cast to string
  readonly items = signal<MyModel[]>([
    { id: '1', icon: this.safe('<svg>...</svg>') }
  ]);
}
```

### Model type uses SafeHtml
```typescript
import { SafeHtml } from '@angular/platform-browser';

export interface MyModel {
  id: string;
  icon: SafeHtml; // ✅ not string
}
```

### Component — zero sanitization logic
```typescript
export class MyComponent {
  private dataService = inject(MyDataService);
  items = this.dataService.items; // Signal read directly
}
```
```html
<!-- Template: Angular renders SafeHtml correctly without stripping -->
<div [innerHTML]="item.icon"></div>
```

> ❌ Never `bypassSecurityTrustHtml` in a component.  
> ❌ Never cast `SafeHtml as string` — it breaks type safety.

---

## 📤 OUTPUT & Input Events

### Pattern: `@Output EventEmitter` with Signals
```typescript
export class ChildComponent {
  // Input
  @Input() selectedItem: Item | null = null;
  
  // Output
  @Output() itemChanged = new EventEmitter<Item>();
  
  selectItem(item: Item) {
    this.itemChanged.emit(item);
  }
}

// Parent component
export class ParentComponent {
  selectedItem = signal<Item | null>(null);
  
  onItemChanged(item: Item) {
    this.selectedItem.set(item);
  }
}
```

---

## 🛡️ TYPE SAFETY Checklist

Project has **strict mode enabled**. All code must:
- ✅ Have explicit type annotations on public APIs
- ✅ Use `signal<T>()` with generic type
- ✅ Use `computed<T>()` with explicit return type when not inferable
- ✅ Handle `null` and `undefined` explicitly
- ✅ Use `?.` optional chaining, not `!` non-null assertion (avoid when possible)

```typescript
// ✅ GOOD
private user = signal<User | null>(null);
public userName = computed<string>(() => this.user()?.name ?? 'Unknown');

// ❌ BAD
private user = signal<any>(null);  // Don't use any
public userName = computed(() => this.user()!.name);  // Don't assert non-null
```

---

## ⚡ PERFORMANCE Best Practices

### 1. Use `track` in @for loops
```html
<!-- ✅ GOOD: Prevents re-rendering on position changes -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ BAD: Re-renders entire list -->
@for (item of items(); track $index) {
  <div>{{ item.name }}</div>
}
```

### 2. Unsubscribe Properly
```typescript
// If using RxJS (legacy)
private destroy$ = new Subject<void>();

ngOnInit() {
  this.observable$
    .pipe(takeUntil(this.destroy$))
    .subscribe(/* ... */);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 3. Avoid Memory Leaks in Timers
```typescript
// ❌ BAD: Timer not cleaned up
setTimeout(() => { /* ... */ }, 5000);

// ✅ GOOD: Proper cleanup
private timerId: any;
ngOnInit() {
  this.timerId = setTimeout(() => { /* ... */ }, 5000);
}
ngOnDestroy() {
  if (this.timerId) clearTimeout(this.timerId);
}
```

---

## 🎯 Session Management Example

**See:** `src/app/core/services/session.service.ts`

```typescript
// Use signals for state
private sessionStateSignal = signal<SessionState>({
  isActive: false,
  timeRemaining: 0,
  showWarning: false
});

// Expose computed
public sessionState = computed(() => this.sessionStateSignal());
public timeRemaining = computed(() => this.sessionStateSignal().timeRemaining);

// Use interval (not timer) for efficiency
effect(() => {
  interval(60000)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      const newState = this.sessionStateSignal();
      this.sessionStateSignal.set({ ...newState, timeRemaining: calculateRemaining() });
    });
});
```

---

## 📚 Common Migration Patterns

| Old Pattern | New Pattern | File | Reason |
|---|---|---|---|
| `BehaviorSubject` | `signal` | `session.service.ts` | 10-30% faster |
| `Observable.subscribe()` | `effect()` or `computed()` | Various | No subscription overhead |
| `*ngIf`, `*ngFor` | `@if`, `@for` | Templates | Faster, cleaner syntax |
| `.subscribe({ })` | `resource()` or effect | Services | Automatic cleanup |
| Constructor DI | `inject()` | All | Tree-shakeable |
| `ngModel` | Signals | Forms | Better performance |

---

## ✅ Code Review Checklist

When reviewing code, verify:
- [ ] No `BehaviorSubject` for new code (use `signal`)
- [ ] All state exposed via `signal`/`computed`
- [ ] Proper cleanup — `takeUntilDestroyed(destroyRef)` or `ngOnDestroy`
- [ ] `@if` and `@for` used instead of `*ngIf`/`*ngFor`
- [ ] `track` specified in all `@for` loops (use `item.id`, not `$index`)
- [ ] No `any` types anywhere
- [ ] `inject()` used for all dependencies — no constructor DI
- [ ] No `CommonModule` imported (standalone components handle their own imports)
- [ ] Public API types explicitly defined (no implicit returns)
- [ ] No memory leaks in timers/subscriptions
- [ ] `httpResource` used for simple HTTP GET calls
- [ ] `DomSanitizer.bypassSecurityTrustHtml` only in services, never components
- [ ] `SafeHtml` type used in models — never cast to `string`
- [ ] Components are thin — data/business logic lives in services

---

## 🔗 References & Resources
- **Angular 19 Docs:** https://angular.dev
- **Signals Guide:** https://angular.dev/guide/signals
- **Control Flow:** https://angular.dev/guide/control-flow
- **Strict Mode:** https://angular.dev/guide/strict-mode
- **httpResource:** https://angular.dev/api/core/resource (experimental)

---

## 📋 Update History

| Date | Angular Version | Changes |
|------|---|---|
| 2026-04-02 | 19.2.20 | Adopted for LogicBank project; fixed version metadata; removed SubscriptionManagementDirective; added SafeHtml/DomSanitizer service pattern; added thin-component rule; updated form state to Reactive Forms; updated lifecycle cleanup to DestroyRef |
| 2026-03-28 | 19.2.20+ | Initial standards document created (CAP-Frontend) |

---

## 🚦 When to Update This File

Update this document when:
- ✅ Angular version changes in `package.json`
- ✅ New Angular features become available/recommended (httpResource stabilized, etc.)
- ✅ Team discovers new best practices or performance improvements
- ✅ Major pattern shift needed across codebase

**Do NOT update for:** Individual component/service changes (those reference this file instead)

---

## 📞 Questions?
Reference this file in code comments:
```typescript
// See ANGULAR-19-STANDARDS.md - Using Signals instead of BehaviorSubject
private state = signal<MyState>({ ... });
```
