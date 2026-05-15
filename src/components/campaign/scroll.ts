export function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    block: 'start',
  })
}
