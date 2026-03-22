import { NavLink } from 'react-router-dom';
import style from '../../scss/header.module.scss';
const Header = () => {
  return (
    <header className={style['header']}>
      <h1 className={style['header__logo']}>CultureCompass</h1>
      <nav className={style['header__navContainer']}>
        <NavLink
          to="/overview"
          className={({ isActive }) =>
            `${style['header__navItem']} ${
              isActive ? style['header__navItem--active'] : ''
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/trends"
          className={({ isActive }) =>
            `${style['header__navItem']} ${
              isActive ? style['header__navItem--active'] : ''
            }`
          }
        >
          Trends
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${style['header__navItem']} ${
              isActive ? style['header__navItem--active'] : ''
            }`
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
