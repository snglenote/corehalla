import { Card } from "../base/Card"
import { GamesDisplay } from "./GamesDisplay"
import { MiscStatGroup } from "./MiscStatGroup"
import { ProgressCard } from "./ProgressCard"
import { cn } from "common/helpers/classnames"

type GeneralStatsProps = {
    className?: string
    games: number
    wins: number
    kos: number
    falls: number
    suicides: number
    teamkos: number
    damageDealt: number
    damageTaken: number
    matchtime: number
}

export const GeneralStats = ({
    className,
    games,
    wins,
    kos,
    falls,
    suicides,
    teamkos,
    damageDealt,
    damageTaken,
    matchtime,
}: GeneralStatsProps) => {
    const kosReference = Math.max(kos, falls, suicides, teamkos)
    const damageReference = Math.max(damageDealt, damageTaken)

    return (
        <>
            <div
                className={cn(
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                    className,
                )}
            >
                <div>
                    <Card title="Games">
                        <GamesDisplay games={games} wins={wins} />
                    </Card>
                </div>
                <ProgressCard
                    title="kos"
                    bars={[
                        {
                            title: "KOs",
                            value: kos,
                            progress: (kos / kosReference) * 100,
                        },
                        {
                            title: "Falls",
                            value: falls,
                            progress: (falls / kosReference) * 100,
                        },
                        {
                            title: "Suicides",
                            value: suicides,
                            progress: (suicides / kosReference) * 100,
                        },
                        {
                            title: "Team KOs",
                            value: teamkos,
                            progress: (teamkos / kosReference) * 100,
                        },
                    ]}
                />
                <div>
                    <ProgressCard
                        title="damage"
                        bars={[
                            {
                                title: "Damage dealt",
                                value: damageDealt,
                                progress: (damageDealt / damageReference) * 100,
                            },
                            {
                                title: "Damage taken",
                                value: damageTaken,
                                progress: (damageTaken / damageReference) * 100,
                            },
                        ]}
                    />
                </div>
            </div>
            <MiscStatGroup
                className="mt-8"
                stats={[
                    {
                        name: "DPS (Dealt)",
                        value: `${(damageDealt / matchtime).toFixed(1)} dmg/s`,
                    },
                    {
                        name: "DPS (Taken)",
                        value: `${(damageTaken / matchtime).toFixed(1)} dmg/s`,
                    },
                    {
                        name: "Time to kill",
                        value: `${(matchtime / kos).toFixed(1)}s`,
                    },
                    {
                        name: "Time to fall",
                        value: `${(matchtime / falls).toFixed(1)}s`,
                    },
                    {
                        name: "Avg. Kos per game",
                        value: (kos / games).toFixed(1),
                    },
                    {
                        name: "Avg. Falls per game",
                        value: (falls / games).toFixed(1),
                    },
                    {
                        name: "1 Suicide every",
                        value: `${(games / suicides).toFixed(1)} games`,
                    },
                    {
                        name: "1 Team KO every",
                        value: `${(games / teamkos).toFixed(1)} games`,
                    },
                    {
                        name: "Avg. dmg dealt per game",
                        value: (damageDealt / games).toFixed(1),
                    },
                    {
                        name: "Avg. dmg taken per game",
                        value: (damageTaken / games).toFixed(1),
                    },
                    {
                        name: "Avg. game length",
                        value: `${(matchtime / games).toFixed(1)}s`,
                    },
                ]}
            />
        </>
    )
}
