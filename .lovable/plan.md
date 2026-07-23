## Fix: Remove unverified power figure from Bus2Grid

The sources describe Bus2Grid's *ambition* (aggregating buses at Europe's largest e-bus depot) but do not publish a confirmed, realized V2G export power level. My earlier "over 1 MW" figure was inferred, not sourced. Remove it.

### Database (`pilots` table, row "Bus2Grid")
- Set `power_kw = NULL`.
- Rewrite the description's Scale block to drop "Site V2G export capacity: over 1 MW"; keep fleet, battery, AC 80 kW/bus, motor specs, and the fleet-scale hypothetical (clearly framed as hypothetical).

### `src/data/pilotMedia.ts` (entry `bus2grid`)
- `overview`: remove "aggregated to over 1 MW of grid export"; describe it as AC-based V2G at Europe's largest e-bus depot coordinated by an Origami router via the cloud.
- Site card details: replace ">1 MW aggregated V2G export capacity" with "V2G export power not publicly disclosed".
- Timeline "Depot operational" entry: drop the ">1 MW" phrasing; keep the note that wholesale, DSO and ESO services were tested.

### Out of scope
- No UI/component changes; PilotCard already handles a missing `power_kw`.
- Other pilots untouched.
