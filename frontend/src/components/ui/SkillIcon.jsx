/**
 * SkillIcon — renders either:
 *  - A Devicon <i> element  (if icon starts with "devicon-")
 *  - An emoji / text span   (for anything else)
 */
const SkillIcon = ({ icon, size = 'text-2xl' }) => {
  if (!icon) return <span className={size}>💡</span>;

  const isDevicon = icon.trim().startsWith('devicon-');
  if (isDevicon) {
    return (
      <i
        className={`${icon.trim()} colored`}
        style={{ fontSize: '1.5rem', lineHeight: 1 }}
        aria-hidden="true"
      />
    );
  }

  // emoji / plain text
  return <span className={size} style={{ lineHeight: 1 }}>{icon}</span>;
};

export default SkillIcon;
