import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ReactNode, useEffect, useState } from 'react';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HexagonTwoToneIcon from '@mui/icons-material/HexagonTwoTone';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import NumbersIcon from '@mui/icons-material/Numbers';
import { Button, CircularProgress, TextField, Tooltip } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import './Keys.css';
import { HumanFileSize } from './HumanFileSize';
import { KeyItemList } from './KeyItemList';
import { KeySummary, useKeyStore } from './Keys.store';
import { KeyItemMenu } from './KeyItemMenu';
import { KeyStats } from '@renderer/lib/tile38Connection.models';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useDebounce, useDebouncedCallback } from 'use-debounce';

// Based on this: https://mui.com/material-ui/react-accordion/

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))((/*{ theme }*/) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Keys() {
  const pattern = useKeyStore(x => x.pattern)
  const setPattern = useKeyStore(x => x.setPattern)
  const keys = useKeyStore(x => x.keys)
  const keyCountShown = useKeyStore(x => x.keyCountShown)
  const setKeyCountShown = useKeyStore(x => x.setKeyCountShown)
  const load = useKeyStore(x => x.load)
  const loading = useKeyStore(x => x.loading)
  const expanded = useKeyStore(x => x.expanded)
  const expand = useKeyStore(x => x.expand)
  const collapse = useKeyStore(x => x.collapse)
  const moreToShow = keyCountShown < keys.length
  const loadDebounced = useDebouncedCallback(load, 300)

  console.log(keyCountShown, keys.length)

  useEffect(() => {
    load();
  }, [])

  return (
    <div className='keys-container'>
      <div className='keys-header'>
        <FilterAltIcon />
        <TextField
          label="Match"
          variant='outlined'
          size='small'
          value={pattern}
          onChange={e => {
            setPattern(e.target.value);
            loadDebounced();
          }} />
        {loading && <CircularProgress size="1em" />}
      </div>
      {keys.slice(0, keyCountShown).map(k => (
        <Accordion
          key={k.key}
          expanded={expanded.includes(k.key)}
          onChange={(_, y) => y ? expand(k.key) : collapse(k.key)}
          slotProps={{
            transition: {
              mountOnEnter: true,
              unmountOnExit: true
            }
          }}
          >
          <AccordionSummary className='key-summary'>
            <KeySummaryView summary={k} />
          </AccordionSummary>
          <AccordionDetails className='key-details'><KeyItemList itemKey={k.key} /></AccordionDetails>
        </Accordion>
      ))}
      {moreToShow && <Button
        fullWidth
        className='load-more'
        variant='contained'
        sx={{ borderRadius: 0 }}
        onClick={() => setKeyCountShown(keyCountShown + 50)}
      >Load 50 more...</Button>}
    </div>
  )
}

function StatChip({ enabled, children, title }: { enabled: boolean, children: ReactNode, title: string }) {
  if (enabled) {
    return (
      <Tooltip title={title}>
        <span className='chip'>{children}</span>
      </Tooltip>
    )
  }
  return undefined;
}

function KeySummaryView({ summary }: { summary: KeySummary }) {
  const [stats, setStats] = useState<KeyStats>();
  const [count, setCount] = useState<number | undefined>(undefined);
  useEffect(() => {
    const load = async () => {
      setStats(await summary.stats());
      setCount(await summary.count());
    };
    load();
  }, []);

  return <>
    <span>{summary.key}</span>
    <div className='chip-container'>
      <div className='chip-block'>
        <StatChip enabled={!!stats?.num_strings} title='# STRINGs' >
          <span><FormatQuoteRoundedIcon />{stats?.num_strings}</span>
        </StatChip>
        <StatChip enabled={!!stats?.num_objects} title='# OBJECTs' >
          <span><HexagonTwoToneIcon />{stats?.num_objects}</span>
        </StatChip>
        <StatChip enabled={!!stats?.num_points} title='# POINTs' >
          <span><PlaceTwoToneIcon />{stats?.num_points}</span>
        </StatChip>
      </div>
      <div className='chip-block'>
        <StatChip enabled={true} title='Memory Used' >
          <span><MemoryIcon />
            {!stats ?
              <CircularProgress size="0.75em" /> :
              <HumanFileSize size={stats?.in_memory_size || 0} />
            }
          </span>
        </StatChip>
        <StatChip enabled={true} title='Count of Items in Key' >
          <span><NumbersIcon />{count || <CircularProgress size="0.75em" />}</span>
        </StatChip>
      </div>
      <div className='chip-block'>
        <KeyItemMenu itemKey={summary.key} />
      </div>
    </div>
  </>
}
