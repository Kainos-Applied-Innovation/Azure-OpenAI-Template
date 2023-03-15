import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function ExamAnswers({ answers }: { answers: string[] }) {
  const [selectedAnswer, setSelectedAnswer] = useState();

  return (
    <RadioGroup value={selectedAnswer} onChange={setSelectedAnswer} className='mt-4 w-full mx-2'>
      <RadioGroup.Label className="sr-only">Answer</RadioGroup.Label>

      <div className="space-y-2">
        {answers.map((answer: string, idx: number) => (
          <RadioGroup.Option
            key={idx}
            value={answer}
            className={({ active, checked }: { active: any, checked: any }) =>
              `${active
                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                : ''
              }
                    ${checked ? 'bg-indigo-400 bg-opacity-75 text-white' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
                          }`}
                      >
                        {answer}
                      </RadioGroup.Label>
                    </div>
                  </div>
                  {checked && (
                    <div className="shrink-0 text-white">
                      <CheckIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}