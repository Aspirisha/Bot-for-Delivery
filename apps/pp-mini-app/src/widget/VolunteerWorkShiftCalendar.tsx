'use client';

import { Dialog, Portal } from '@ark-ui/react';
import { useRef, useState } from 'react';

import { VolunteerShift } from '@/entity/shift/types';
import { VolunteerShiftControl } from '@/features/VolunteerShiftForm';
import {
  VolunteerCalendar,
  VolunteerCalendarRef,
} from '@/features/VoulonteerCalendar';

export function VolunteerWorkShiftCalendar() {
  const calendarRef = useRef<VolunteerCalendarRef>(null);
  const [selectedShift, setSelectedShift] = useState<VolunteerShift | null>(
    null
  );
  return (
    <>
      <VolunteerCalendar
        ref={calendarRef}
        onChangeValue={(value) => setSelectedShift(value)}
        onDateReset={() => setSelectedShift(null)}
      />
      <Dialog.Root
        open={selectedShift !== null}
        modal
        lazyMount
        unmountOnExit
        onOpenChange={({ open }) => {
          if (!open) {
            calendarRef.current?.resetCalendar();
          }
        }}
      >
        <Portal>
          <Dialog.Positioner className="absolute z-10 flex justify-center items-center">
            <Dialog.Content className="flex bg-[var(--tg-theme-bg-color)] p-5 rounded-lg">
              {selectedShift === null ? (
                <></>
              ) : (
                <VolunteerShiftControl
                  shift={selectedShift}
                  onActionComplete={() =>
                    calendarRef.current?.resetAndRefresh()
                  }
                />
              )}
            </Dialog.Content>
          </Dialog.Positioner>
          <Dialog.Backdrop className="fixed size-full bg-black/50" />
        </Portal>
      </Dialog.Root>
    </>
  );
}
