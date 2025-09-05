import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // ✅ Add this
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';  
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Header } from './header/header';
import { Fooder } from './fooder/fooder';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Dashboard,
    Header,
    Fooder
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
      provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
