import React from 'react';
import PropTypes from 'prop-types';
import './MyMenu.scss';
import { IconPC } from '../IconPC/IconPC';

import Link from 'next/link';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';

export const MyMenu = ({ anchorEl, isOpen, onClose, list, type }) => {

  if (type !== 'form_order') {
    if (!anchorEl && isOpen === true) {
      return (
        <Paper className="MyMenuPaper">
          <ul className="MyMenu">
            {list.map((item) => (
              <li key={item.link} onClick={onClose}>
                {type === 'cat' ? (
                  <Link href={item.link}>{item.title}</Link>
                ) : (
                  <span>{item.title}</span>
                )}
              </li>
            ))}
          </ul>
        </Paper>
      );
    }

    return (
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoFocus={false}
        className={type === 'contacts' ? "MyMenu Contacts" : type === 'modal' ? "MyMenu Modal" : "MyMenu"}
        style={{
          marginTop: type === 'cat' ? '1.4440433212996vw' : '0.72202166064982vw',
        }}
      >
        {list.map((item, key) => (
          <li key={key} onClick={onClose}>
            {type === 'cat' ? (
              <Link href={item.link}>{item.title}</Link>
            ) : (
              <span>{item.title}</span>
            )}
          </li>
        ))}
      </Menu>
    );
  }

  if (type === 'form_order') {

    if (!anchorEl && isOpen === true) {
      return (
        <Paper className="MyMenuPaper_FormOrder">
          <ul className="MyMenu_FormOrder">
            {list.map((item, key) => (
              <li key={key} onClick={onClose} className='menuItem'>
                <div>
                  <div className='containerSpan'>
                    <span>
                      {item?.addr_name ? (
                        <span style={{ textTransform: 'uppercase' }}>
                          {item.addr_name + ', '}
                        </span>
                      ) : null}
                      {item.name}
                    </span>
                    {parseInt(item?.is_main) ? (
                      <span className="home">
                        <IconPC icon='home' element="form_order" />
                      </span>
                    ) : null}
                  </div>
                  {item.name !== 'Добавить новый адрес' ? (
                    <span className="dopAddrInfo">
                      {item?.pd?.length > 0 && parseInt(item?.pd) > 0
                        ? 'Пд: ' + item?.pd + ', '
                        : ''}
                      {item?.et?.length > 0 && parseInt(item?.et) > 0
                        ? 'Этаж: ' + item?.et + ', '
                        : ''}
                      {item?.dom_true ? parseInt(item?.dom_true) == 0
                        ? 'Домофон: не работает'
                        : 'Домофон: работает'
                        : ''
                      }
                    </span>
                  ) : (
                    false
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Paper>
      );
    }

    return (
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        className="MyMenu_FormOrder"
      >
        {list.map((item, key) => (
          <li key={key} onClick={onClose} className='menuItem'>
            <div>
              <div className='containerSpan'>
                <span>
                  {item?.addr_name ? (
                    <span style={{ textTransform: 'uppercase' }}>
                      {item.addr_name + ', '}
                    </span>
                  ) : null}
                  {item.name}
                </span>
                {parseInt(item?.is_main) ? (
                  <span className="home">
                    <IconPC icon='home' element="form_order" />
                  </span>
                ) : null}
              </div>
              {item.name !== 'Добавить новый адрес' ? (
                <span className="dopAddrInfo">
                  {item?.pd?.length > 0 && parseInt(item?.pd) > 0
                    ? 'Пд: ' + item?.pd + ', '
                    : ''}
                  {item?.et?.length > 0 && parseInt(item?.et) > 0
                    ? 'Этаж: ' + item?.et + ', '
                    : ''}
                  {item?.dom_true ? parseInt(item?.dom_true) == 0
                    ? 'Домофон: не работает'
                    : 'Домофон: работает'
                    : ''
                  }
                </span>
              ) : (
                false
              )}
            </div>
          </li>
        ))}
      </Menu>
    );
  }
};

MyMenu.propTypes = {
  list: PropTypes.array,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  anchorEl: PropTypes.node,
  type: PropTypes.string.isRequired,
};
