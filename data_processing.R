library(readxl)
library(dplyr)
library(xtable)

coach <- read_excel("coachella_rev.xlsx")

coach <-coach %>%
  mutate(rev_m = round(rev/1000000,1))

cat(paste(shQuote(coach$rev_m),collapse=","))
cat(paste(shQuote(coach$notes),collapse=","))

coach_tbl <- coach %>%
  select(Year = round(year,0),notes,Headliner_1 = head1,Headliner_2 = head2,Headliner_3 = head3)

print(xtable(coach_tbl), type="html",include.rownames=FALSE)