twNotice('Example Rulesets comes with rules validator. Our abstract game army have two rules:')
twNotice('rule 1: There have to be exacly one Hero unit in Army')
twNotice('rule 2: There can be only one Wagon per each Soldier Squad')
twNotice('Play with Your units to see how it works. ')


local h=0
local s=0
local w=0


for i,unit in twArmy:units() do
 
  if (unit.defaultName=='Hero') then
    h=h+1
  end
  if (unit.defaultName=='Soldier Squad Wagon') then
    w=w+1
  end
  if (unit.defaultName=='Soldier Squad') then
    s=s+1
  end
  
end


--there can be only one hero.
if (h~=1) then
  twError('There has to be exacly 1 Hero unit in Your army!!!!');
end

--there can't be less soldier squads than wagons
if (w>s) then
  twError('You Can Have only 1 Wagon per each Soldier Squad!!!!');  
end