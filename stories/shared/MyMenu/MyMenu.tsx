import React, { MouseEvent } from 'react';
import './MyMenu.scss';
import { IconPC } from '../IconPC/IconPC';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';

interface MenuItem {
  link?: string;
  title?: string;
  name?: string;
  addr_name?: string;
  is_main?: string;
  pd?: string;
  et?: string;
  dom_true?: string;
}

interface SubCatItem {
  id: string;
  name: string;
  link: string;
}

interface CatItem {
  id: string;
  name: string;
  cats: SubCatItem[];
}

interface MyMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  list: MenuItem[] | CatItem[] | SubCatItem[];
  type: 'cat' | 'form_order' | 'contacts' | 'modal';
}

export const MyMenu: React.FC<MyMenuProps> = ({ anchorEl, isOpen, onClose, list, type }) => {
  if (type !== 'form_order') {
    if (!anchorEl && isOpen === true) {
      return (
        <Paper className="MyMenuPaper">
          <ul className="MyMenu">
            {(list as SubCatItem[]).map((item: SubCatItem) => (
              <li key={item.id || item.link} onClick={onClose}>
                {type === 'cat' ? (
                  <Link href={item.link || '/'}>{item.name || item.title}</Link>
                ) : (
                  <span>{item.name || item.title}</span>
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
        {(list as SubCatItem[]).map((item: SubCatItem, index: number) => (
          <li key={item.id || item.link || index} onClick={onClose}>
            {type === 'cat' ? (
              <Link href={item.link || '/'}>{item.name || item.title}</Link>
            ) : (
              <span>{item.name || item.title}</span>
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
            {(list as MenuItem[]).map((item: MenuItem, key: number) => (
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
                    {parseInt(item?.is_main || '0') ? (
                      <span className="home">
                        <IconPC icon='home' element="form_order" />
                      </span>
                    ) : null}
                  </div>
                  {item.name !== 'Добавить новый адрес' ? (
                    <span className="dopAddrInfo">
                      {item?.pd && item?.pd.length > 0 && parseInt(item.pd) > 0
                        ? 'Пд: ' + item.pd + ', '
                        : ''}
                      {item?.et && item?.et.length > 0 && parseInt(item.et) > 0
                        ? 'Этаж: ' + item.et + ', '
                        : ''}
                      {item?.dom_true ? parseInt(item.dom_true) === 0
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
        {(list as MenuItem[]).map((item: MenuItem, key: number) => (
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
                {parseInt(item?.is_main || '0') ? (
                  <span className="home">
                    <IconPC icon='home' element="form_order" />
                  </span>
                ) : null}
              </div>
              {item.name !== 'Добавить новый адрес' ? (
                <span className="dopAddrInfo">
                  {item?.pd && item?.pd.length > 0 && parseInt(item.pd) > 0
                    ? 'Пд: ' + item.pd + ', '
                    : ''}
                  {item?.et && item?.et.length > 0 && parseInt(item.et) > 0
                    ? 'Этаж: ' + item.et + ', '
                    : ''}
                  {item?.dom_true ? parseInt(item.dom_true) === 0
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

  return null;
};
