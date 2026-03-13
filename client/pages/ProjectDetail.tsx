import { useParams, Link } from "react-router-dom";
import { PROJECTS } from "@/lib/data";
import { ArrowLeft, ExternalLink, Github, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { lenis } from "@/lib/lenis";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = PROJECTS.find((p) => p.id === id);

  useEffect(() => {
    // Ensure we start at the top of the page when loaded
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-4xl font-display font-bold mb-4">
          Project Not Found
        </h1>
        <p className="text-zinc-400 mb-8">
          The project you are looking for does not exist.
        </p>
        <Link to="/">
          <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
      <motion.main
        initial={{ opacity: 0, filter: "brightness(0)" }}
        animate={{ opacity: 1, filter: "brightness(1)" }}
        exit={{ opacity: 0, filter: "brightness(0)" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="min-h-screen text-white pb-20 pt-24"
      >
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(700px_300px_at_50%_-10%,hsl(var(--neon-purple)/.1),transparent),radial-gradient(700px_300px_at_80%_30%,hsl(var(--neon-blue)/.1),transparent)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <div className="container max-w-6xl mx-auto px-6 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </Link>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4">
            {project.title}
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
            >
              <Github className="mr-2 h-5 w-5" /> View Source
            </a>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="mr-2 h-5 w-5" /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-2 mb-16 overflow-hidden shadow-2xl">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {project.images.map((imgSrc, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/50 flex items-center justify-center">
                    <img
                      src={imgSrc}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.images.length > 1 && (
              <>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-4 bg-black/50 border-white/10 hover:bg-black/80" />
                  <CarouselNext className="right-4 bg-black/50 border-white/10 hover:bg-black/80" />
                </div>
              </>
            )}
          </Carousel>
        </div>

        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="w-8 h-1 bg-neon-purple rounded-full mr-3"></span>
                Overview
              </h2>
              <div className="text-zinc-300 leading-relaxed space-y-4">
                <p>{project.longDescription}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <span className="w-8 h-1 bg-neon-blue rounded-full mr-3"></span>
                Key Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-neon-purple mr-3 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-200 hover:bg-white/10 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 backdrop-blur-sm p-6 flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Like what you see?
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Let's build something amazing together.
              </p>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshusinghchauhan40@example.com&su=Hello&body=I%20want%20to%20get%20in%20touch%20with%20you"
                className="w-full text-center px-6 py-3 rounded-full text-sm font-medium text-white bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink bg-[length:200%_200%] hover:bg-[position:100%_0%] transition-all duration-500"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
