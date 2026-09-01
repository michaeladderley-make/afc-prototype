import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MOCK_FAQS } from "@/lib/mock-faqs";

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {MOCK_FAQS.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-base font-medium tracking-[0.07px] hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-6 text-muted-foreground">
            <p>{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
