import { DatePicker, useDatePicker, UseDatePickerReturn } from '@ark-ui/react';
import { CalendarDate, fromDate, now } from '@internationalized/date';
import { ValueChangeDetails } from '@zag-js/date-picker';
import { clsx } from 'clsx';
import { startOfDay } from 'date-fns/startOfDay';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo } from 'react';

import { Noop } from '@/shared/types';

interface TelegramCalendarProps {
  datepicker: UseDatePickerReturn;
  highlightedDays?: Set<number>;
  isWarrning?: (timestamp: number) => boolean;
}

export const TelegramCalendar = ({
  datepicker,
  highlightedDays,
  isWarrning,
}: TelegramCalendarProps) => {
  return (
    <DatePicker.RootProvider value={datepicker} className="w-full m-auto pb-5">
      <DatePicker.Content className="flex flex-col">
        <div className="flex flex-col">
          <div className="grid grid-cols-[auto_1fr_auto] justify-items-center items-center">
            <DatePicker.PrevTrigger className="btn btn-info btn-square">
              <ChevronLeftIcon />
            </DatePicker.PrevTrigger>
            <span>
              {datepicker.visibleRangeText.start[0].toUpperCase()}
              {datepicker.visibleRangeText.start.slice(1)}
            </span>
            <DatePicker.NextTrigger className="btn btn-info btn-square">
              <ChevronRightIcon />
            </DatePicker.NextTrigger>
          </div>
          <DatePicker.Table className="flex flex-col mt-7 w-full">
            <DatePicker.TableHead className="flex gap-1">
              <DatePicker.TableRow className="grid grid-cols-7 gap-1 justify-content-stretch w-full">
                {datepicker.weekDays.map((weekDay, id) => (
                  <DatePicker.TableHeader
                    className="w-full border border-transparent capitalize"
                    key={id}
                  >
                    {weekDay.short}
                  </DatePicker.TableHeader>
                ))}
              </DatePicker.TableRow>
            </DatePicker.TableHead>
            <DatePicker.TableBody className="flex gap-1 flex-col grow mt-5">
              {datepicker.weeks.map((week, id) => (
                <DatePicker.TableRow
                  key={id}
                  className="grid grid-cols-7 gap-1 w-full grow"
                >
                  {week.map((day, id) => {
                    const isDisabled = datepicker.isUnavailable(day);
                    const _isWarrning = Boolean(
                      !isDisabled &&
                        isWarrning &&
                        isWarrning(startOfDay(day.toDate(CURRENT_TZ)).getTime())
                    );
                    const _isHightlited = Boolean(
                      highlightedDays?.has(
                        startOfDay(day.toDate(CURRENT_TZ)).getTime()
                      )
                    );
                    return (
                      <DatePicker.TableCell
                        key={id}
                        value={day}
                        className="flex aspect-square"
                      >
                        <button
                          disabled={isDisabled}
                          onClick={() => {
                            datepicker.setValue([day as CalendarDate]);
                          }}
                          className={clsx(
                            'btn btn-wide !h-full px-[6px] py-0.5 flex justify-end items-end text-xl overflow-hidden',
                            isDisabled ? 'btn-dash' : null,
                            _isWarrning
                              ? _isHightlited
                                ? 'btn-error'
                                : 'btn-warning'
                              : null
                          )}
                        >
                          {day.day.toString()}
                        </button>
                      </DatePicker.TableCell>
                    );
                  })}
                </DatePicker.TableRow>
              ))}
            </DatePicker.TableBody>
          </DatePicker.Table>
        </div>
      </DatePicker.Content>
    </DatePicker.RootProvider>
  );
};

export const CURRENT_TZ = 'Europe/Moscow';

interface UseTelegramCalendarProps {
  onChangeValue: (date: Date) => ReturnType<Noop>;
  onDateReset: Noop;
  isDateUnavailable?: (date: Date) => boolean;
  maxDate?: Date;
}

TelegramCalendar.useDatepicker = ({
  isDateUnavailable,
  onDateReset,
  onChangeValue,
  maxDate,
}: UseTelegramCalendarProps) => {
  const datePicker = useDatePicker({
    open: true,
    selectionMode: 'single',
    locale: 'ru',
    min: now(CURRENT_TZ),
    max: maxDate ? fromDate(maxDate, CURRENT_TZ) : undefined,
    isDateUnavailable: (date) => {
      let result = true;
      const isOutOfRange =
        datePicker.visibleRange.end.compare(date) < 0 ||
        datePicker.visibleRange.start.compare(date) > 0;
      if (!isOutOfRange && isDateUnavailable) {
        result = isDateUnavailable(date.toDate(CURRENT_TZ));
      }
      return result;
    },
    onValueChange: async ({ value }: ValueChangeDetails) => {
      const selectedDate = value[0];
      if (selectedDate) {
        await onChangeValue(selectedDate.toDate(CURRENT_TZ));
      } else {
        await onDateReset();
      }
    },
  });

  const dateRange = useMemo(
    () => ({
      end: datePicker.visibleRange.end.toDate(CURRENT_TZ),
      start: datePicker.visibleRange.start.toDate(CURRENT_TZ),
    }),
    [datePicker.visibleRange.end, datePicker.visibleRange.start]
  );

  return {
    resetCalendar: () => {
      const currentDate = datePicker.value[0];
      if (currentDate) {
        datePicker.clearValue();
        datePicker.focusMonth(currentDate.month);
      }
    },
    dateRange,
    datePicker,
  };
};
