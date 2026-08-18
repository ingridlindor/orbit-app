import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { login } from "@/app/auth/actions";
import TimerRing from "@/components/ui/landing/TimerRing";



export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-deep-space overflow-x-hidden">
      <nav className="hidden md:block border-b border-mist/10 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-4 py-4">
          <Image
            src="/orbit_logo_vectorized_white.svg"
            alt="Orbit Logo"
            width={640}
            height={400}
            className="h-13 w-auto md:h-15"
          />
          <Button className="h-9 md:h-12 px-3 md:px-6 text-sm md:text-base whitespace-nowrap">
            See how it works
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 flex-col md:flex-row items-center justify-center">
        <div className="flex w-full max-w-6xl items-center justify-center gap-8 md:gap-24 flex-col md:flex-row px-8 md:px-0">
          <div className="order-2 md:order-1 hidden md:flex items-center justify-center">
            <TimerRing />
          </div>

          {/* Lado direito: form de login */}
          <div className="order-1 md:order-2 flex items-center justify-center px-1 py-1 w-full md:min-w-[24rem] md:w-auto">
            <div className="w-full max-w-sm">
              <Image
                src="/orbit_logo_vectorized_white.svg"
                alt="Orbit Logo"
                width={640}
                height={400}
                className="h-20 w-auto md:h-19 mx-auto mb-6 md:hidden"
              />
              <h1 className="font-display text-2xl text-white mb-1 text-center md:text-left">
                Welcome to Orbit!
              </h1>
              <p className="font-body text-sm text-white/60 mb-8 text-center md:text-left">
                Sign in to continue on Orbit
              </p>

              <form action={login}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="email" className="text-white/80">
                      E-mail
                    </FieldLabel>
                    <Input id="email" name="email" type="email" required placeholder="Your-email@email.com" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password" className="text-white/80">
                      password
                    </FieldLabel>
                    <Input id="password" name="password" type="password" required placeholder="••••••••" />
                  </Field>

                  <Button
                    type="submit"
                    className="mt-2 bg-signal-amber text-deep-space font-medium hover:bg-signal-amber/90"
                  >
                    Login
                  </Button>
                </FieldGroup>
              </form>

              <div className="flex justify-between mt-4 text-sm">
                <Link href="/forgot-password" className="text-white/50 hover:text-orbit-blue transition-colors">
                  forgot password?
                </Link>
                <Link href="/signup" className="text-white/50 hover:text-orbit-blue transition-colors">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-mist/10 py-4 md:py-8 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 md:px-8 font-mono text-xs text-mist gap-2 text-center">
          <p>© 2026 ORBIT</p>
          <p>built with next.js · supabase · claude</p>
        </div>
      </footer>
    </div>
  );
}