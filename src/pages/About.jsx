import { PROFILE } from '../data/profile.js'
import { BRAND } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import SocialLinks from '../components/SocialLinks.jsx'
import portrait from '../assets/peace.jpg'

export default function About() {
  useDocumentTitle(`About me | ${BRAND}`)
  return (
    <article className="wrap about">
      <div className="about-grid">
        <aside className="about-aside">
          <figure className="portrait">
            <img src={portrait} width="864" height="1080" alt={PROFILE.portraitAlt} />
          </figure>
        </aside>

        <div className="about-main">
          <h1>{PROFILE.greeting}</h1>
          <p className="byline">{PROFILE.fullName}</p>
          {PROFILE.intro.map((text) => <p className="lead" key={text}>{text}</p>)}
          <SocialLinks withEmail />

          <section className="about-sec" aria-labelledby="values-title">
            <h2 id="values-title">{PROFILE.valuesTitle}</h2>
            <dl className="facts">
              {PROFILE.values.map((value) => (
                <div key={value.label}>
                  <dt>{value.label}</dt>
                  <dd>{value.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="about-sec" aria-labelledby="bio-title">
            <h2 id="bio-title">{PROFILE.bioTitle}</h2>
            <p className="lead">{PROFILE.bio}</p>
            {PROFILE.cvLink && <p><a className="btn" href={PROFILE.cvLink.href} target="_blank" rel="noopener noreferrer">{PROFILE.cvLink.label}</a></p>}
          </section>
        </div>
      </div>
    </article>
  )
}
