import React, { useRef, useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import Credits from '../Credits/Credits';
import FilterModeSelector from './FilterModeSelector';
import FilterMessageLimitsForm from './FilterMessageLimitsForm';
import FilterMessageDatesForm from './FilterMessageDatesForm';

import * as S from './style';
import {
  activeUserAtom,
  isMenuOpenAtom,
  messagesDateBoundsAtom,
  participantsAtom,
} from '../../stores/global';
import {
  datesAtom,
  globalFilterModeAtom,
  limitsAtom,
} from '../../stores/filters';
import ActiveUserSelector from './ActiveUserSelector';

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom);
  const [filterMode, setFilterMode] = useState('index');
  const setGlobalFilterMode = useSetAtom(globalFilterModeAtom);
  const [limits, setLimits] = useAtom(limitsAtom);
  const setDates = useSetAtom(datesAtom);
  const messagesDateBounds = useAtomValue(messagesDateBoundsAtom);
  const participants = useAtomValue(participantsAtom);
  const [activeUser, setActiveUser] = useAtom(activeUserAtom);

  const closeButtonRef = useRef(null);
  const openButtonRef = useRef(null);

  const setMessageLimits = e => {
    const entries = Object.fromEntries(new FormData(e.currentTarget));

    e.preventDefault();
    setLimits({ low: entries.lowerLimit, high: entries.upperLimit });
    setGlobalFilterMode('index');
  };

  const setMessagesByDate = e => {
    e.preventDefault();
    setDates({
      start: e.currentTarget.startDate.valueAsDate,
      end: e.currentTarget.endDate.valueAsDate,
    });
    setGlobalFilterMode('date');
  };

  useEffect(() => {
    const keyDownHandler = e => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', keyDownHandler);
    return () => document.removeEventListener('keydown', keyDownHandler);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) closeButtonRef.current.focus();
    else openButtonRef.current.focus();
  }, [isMenuOpen]);

  return (
    <>
      <S.MenuOpenButton
        className="menu-open-button"
        type="button"
        onClick={() => setIsMenuOpen(true)}
        ref={openButtonRef}
      >
        Open menu
      </S.MenuOpenButton>
      <S.Overlay
        type="button"
        isActive={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        tabIndex="-1"
      />
      <S.Sidebar isOpen={isMenuOpen}>
        <S.MenuCloseButton
          type="button"
          onClick={() => setIsMenuOpen(false)}
          ref={closeButtonRef}
        >
          Close menu
        </S.MenuCloseButton>
        <S.SidebarContainer>
          <S.SidebarChildren>
            <FilterModeSelector
              filterMode={filterMode}
              setFilterMode={setFilterMode}
            />
            {filterMode === 'index' && (
              <FilterMessageLimitsForm
                limits={limits}
                setMessageLimits={setMessageLimits}
              />
            )}
            {filterMode === 'date' && (
              <FilterMessageDatesForm
                messagesDateBounds={messagesDateBounds}
                setMessagesByDate={setMessagesByDate}
              />
            )}
            <ActiveUserSelector
              participants={participants}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />
          </S.SidebarChildren>
          <Credits />
        </S.SidebarContainer>
      </S.Sidebar>
    </>
  );
}

export default Sidebar;
