import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Tile38Context } from '../lib/tile38Connection';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HexagonTwoToneIcon from '@mui/icons-material/HexagonTwoTone';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import NumbersIcon from '@mui/icons-material/Numbers';
import { Tooltip } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import './Keys.css';
import { HumanFileSize } from './HumanFileSize';
import { KeyItemList } from './KeyItemList';
import { KeyStats, KeysResponse } from '../lib/tile38Connection.models';
import { removeItem } from '../lib/arrayHelpers';

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

interface KeySummary {
  key: string
  count: number
  stats: KeyStats
}

export default function Keys() {
  const tile38 = useContext(Tile38Context);
  const [keys, setKeys] = useState<KeySummary[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleChange = useCallback((panel: string, expanding: boolean) => {
    if (expanding) setExpanded([...expanded, panel]);
    else setExpanded([...removeItem(expanded, panel)]);
  }, [expanded]);

  const loadKeys = useCallback(async () => {
    const response = await tile38.raw("KEYS *") as KeysResponse;
    const newKeys = [];

    for (let i = 0; i < response.keys.length; i++) {
      const key = response.keys[i];
      newKeys.push({
        key,
        count: (await tile38.keysCount(key)).count,
        stats: (await tile38.stats(key)).stats[0]!
      })
    }

    setKeys(newKeys.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase())));

  }, [tile38]);

  useEffect(() => {
    loadKeys();
  }, [loadKeys])

  return (
    <div className='keys-container'>
      {keys.map(k => (
        <Accordion key={k.key} expanded={expanded.includes(k.key)} onChange={(_, y) => handleChange(k.key, y)}>
          <AccordionSummary className='key-summary'>
            <span>{k.key}</span>
            <div className='chip-container'>
              <div className='chip-block'>
                <StatChip enabled={!!k.stats.num_strings} title='# STRINGs' >
                  <span><FormatQuoteRoundedIcon />{k.stats.num_strings}</span>
                </StatChip>
                <StatChip enabled={!!k.stats.num_objects} title='# OBJECTs' >
                  <span><HexagonTwoToneIcon />{k.stats.num_objects}</span>
                </StatChip>
                <StatChip enabled={!!k.stats.num_points} title='# POINTs' >
                  <span><PlaceTwoToneIcon />{k.stats.num_points}</span>
                </StatChip>
              </div>
              <div className='chip-block'>
                <StatChip enabled={true} title='Memory Used' >
                  <span><MemoryIcon /><HumanFileSize size={k.stats.in_memory_size} /></span>
                </StatChip>
                <StatChip enabled={true} title='Count of Items in Key' >
                  <span><NumbersIcon />{k.count}</span>
                </StatChip>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails className='key-details'><KeyItemList itemKey={k.key} /></AccordionDetails>
        </Accordion>
      ))}
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
}