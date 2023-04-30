import Link from 'next/link';
import styles from './footer.module.css';
import packageJSON from '../package.json';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <span>LiFT</span>
        </li>
        <li className={styles.navItem}>
          <span>Dynamic NFT commerce</span>
        </li>
        <li className={styles.navItem}>
          <span>with Chainlink</span>
        </li>
        <li className={styles.navItem}>
          <Link href='https://github.com/codestates-beb/BEB-08-LiFT'>
            GitHub
          </Link>
        </li>
        <li className={styles.navItem}>
          <em>next-auth@{packageJSON.dependencies['next-auth']}</em>
        </li>
      </ul>
    </footer>
  );
}
