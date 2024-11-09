"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {TimePicker} from "@mui/x-date-pickers"
import { start } from "repl";


interface Day {
    day: string;
    isAVailable: boolean;
}


const Availability = () => {
    const weekDays = [
        {
            day: 'MONDAY',
        isAVailable: false,
            startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
        {
            day: 'TUESDAY',
          isAVailable: false,
          startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
        {
            day: 'WEDNESDAY',
          isAVailable: false,
          startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
        {
            day: 'THURSDAY',
          isAVailable: true,
          startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
        {
            day: 'FRIDAY',
          isAVailable: true,
          startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
        {
            day: 'SATURDAY',
          isAVailable: false,
          startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
        {
            day: 'SUNDAY',
          isAVailable: false,
          startTime: new Date().getHours(),
            endTime: new Date().getHours(),
        },
    ]
    type WeekDay = {
        day: string;
      isAVailable: boolean;
      startTime: number;
        endTime: number;
    }
    const [available,setAvailable] = useState<WeekDay[]>(weekDays);
    useEffect(() => {
        console.log(available);
        
    },
        [available]
    )
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        console.log(data.startTime);
        console.log(data.endTime);
        console.log(data.timeGap);
    }
    return (
      <div>
        <h1>Availability</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            {available.map((day) => (
              <div key={day.day} className="flex gap-4">
                <input
                  type="checkbox"
                  name={day.day}
                  defaultChecked={day.isAVailable}
                  onClick={() =>
                    setAvailable((prev) =>
                      prev.map((prevDay) => {
                        if (prevDay.day === day.day) {
                          return {
                            ...prevDay,
                            isAVailable: !prevDay.isAVailable,
                          };
                        }
                        return prevDay;
                      })
                    )
                  }
                />
                <label>{day.day}</label>
                {day.isAVailable ? (
                  <div className=" text-white p-2 flex flex-row rounded-md">
                    <label htmlFor="startTime" className="block text-gray-700">
                      StartTime
                    </label>
                            <TimePicker
                      label="startTime"
                      value={day.startTime}
                                views={['hours', 'minutes']}
                            />
                    <label htmlFor="endTime" className="block text-gray-700">
                      EndTime
                    </label>
                    <TimePicker
                      label="endTime"
                      value={day.endTime}
                                views={['hours', 'minutes']}
                    />
                    <label htmlFor="timeGap" className="block text-gray-700">
                      TimeGap
                    </label>
                    <input type="number" name="timeGap" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <Button>Submit</Button>
        </form>
      </div>
    );
}

export default Availability