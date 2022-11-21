import { numericLiteralValidator } from "common/helpers/validators"
import { publicProcedure } from "../../trpc"
import { supabaseService } from "db/supabase/service"
import { z } from "zod"
import type { BHPlayerAlias } from "db/generated/client"

export const getPlayerAliases = publicProcedure //
    .input(
        z.object({
            playerId: numericLiteralValidator,
        }),
    )
    .query(async (req) => {
        const { playerId } = req.input
        console.log("getPlayerAliases", req.input)

        const { data, error } = await supabaseService
            .from<BHPlayerAlias>("BHPlayerAlias")
            .select("*")
            .match({ playerId })

        if (error) throw error

        return data.map((alias) => alias.alias)
    })
