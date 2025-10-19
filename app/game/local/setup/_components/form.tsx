"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { Plus, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/primitives/components/ui/button";
import { Checkbox } from "@/primitives/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/primitives/components/ui/field";
import { Input } from "@/primitives/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/primitives/components/ui/input-group";
import { gameSettingsAtom } from "../../_store/game-settings";

const MIN_PLAYERS = 3;

export const localGameFormSchema = z
  .object({
    players: z
      .array(
        z.object({
          name: z.string().trim().nonempty("Player name is required"),
        }),
      )
      .min(MIN_PLAYERS),
    numberOfSpies: z.string(),
    randomNumberOfSpies: z.boolean(),
  })
  .refine(
    ({ numberOfSpies, players, randomNumberOfSpies }) =>
      randomNumberOfSpies || players.length > Number(numberOfSpies),
    {
      message: "There should be more players than spies",
      path: ["numberOfSpies"],
    },
  );

export const LocalUsersForm: FC = () => {
  const form = useForm<z.infer<typeof localGameFormSchema>>({
    defaultValues: {
      players: Array.from({ length: MIN_PLAYERS }).map(() => ({ name: "" })),
      numberOfSpies: "1",
      randomNumberOfSpies: false,
    },
    resolver: zodResolver(localGameFormSchema),
  });

  const {
    fields: players,
    append: addPlayer,
    remove: removePlayer,
  } = useFieldArray({
    control: form.control,
    name: "players",
  });

  const setGameSettings = useSetAtom(gameSettingsAtom);
  const router = useRouter();

  const randomNumberOfSpies = form.watch("randomNumberOfSpies");

  const handleSubmit = (payload: z.infer<typeof localGameFormSchema>) => {
    setGameSettings(payload);
    router.push("/game/local/play");
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FieldLegend>Game Settings</FieldLegend>
          <FieldDescription>
            Configure your game, at least {MIN_PLAYERS} players
          </FieldDescription>
          <FieldGroup>
            <Controller
              control={form.control}
              name="numberOfSpies"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex sm:flex-row">
                  <FieldLabel>Number of spies</FieldLabel>
                  <div>
                    <Input
                      {...field}
                      disabled={randomNumberOfSpies}
                      placeholder="Number of spies"
                      type="number"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="randomNumberOfSpies"
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-between">
                    <FieldLabel>Random number of spies</FieldLabel>
                    <div>
                      <Checkbox
                        onCheckedChange={(value) => {
                          onChange(value);
                          form.trigger("numberOfSpies");
                        }}
                        checked={value}
                      />
                    </div>
                  </div>
                  {value && (
                    <small className="text-yellow-400">
                      Sometimes the number of spies can match the number of
                      players, but hey at least it's gonna be funny!
                    </small>
                  )}
                </Field>
              )}
            />
            {players.map((player, index) => (
              <Controller
                key={player.id}
                control={form.control}
                name={`players.${index}.name`}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex sm:flex-row">
                    <FieldLabel>Player #{index + 1}</FieldLabel>
                    <div>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder={`Player #${index + 1}`}
                        />
                        {players.length > MIN_PLAYERS && (
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => removePlayer(index)}
                              aria-label={`Remove player ${index + 1}`}>
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
            ))}
            <div className="flex gap-2 *:flex-1">
              <Button
                variant="outline"
                type="button"
                onClick={() => addPlayer({ name: "" })}>
                <Plus />
                Add Player
              </Button>
              <Button>Play!</Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};
