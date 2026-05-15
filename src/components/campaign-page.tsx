import type { Dictionary } from '#/i18n'
import EmailActionSection from './campaign/email-action-section'
import HeroSection from './campaign/hero-section'
import IssueSection from './campaign/issue-section'
import ScenariosSection from './campaign/scenarios-section'
import SourcesSection from './campaign/sources-section'
import WhySection from './campaign/why-section'

interface CampaignPageProps {
  t: Dictionary
}

export default function CampaignPage({ t }: CampaignPageProps) {
  return (
    <main id="top" className="min-h-svh bg-background pt-20 text-foreground">
      <HeroSection t={t} />
      <IssueSection t={t} />
      <WhySection t={t} />
      <ScenariosSection t={t} />
      <EmailActionSection t={t} />
      <SourcesSection t={t} />
    </main>
  )
}
