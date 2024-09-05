import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

const TeamList = () => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Team A
            </Box>
            <FiChevronDown />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          Team A Members and Activities
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Team B
            </Box>
            <FiChevronDown />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          Team B Members and Activities
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TeamList;
